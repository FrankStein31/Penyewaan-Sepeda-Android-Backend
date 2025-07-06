const db = require('../Config/database.js');

// Fungsi helper untuk menghitung denda
const calculatePenalty = (endTime, returnTime = new Date()) => {
    if (!returnTime) return 0;
    
    const endDateTime = new Date(endTime);
    const returnDateTime = new Date(returnTime);
    
    if (returnDateTime <= endDateTime) return 0;
    
    const diffMinutes = Math.ceil((returnDateTime - endDateTime) / (1000 * 60));
    const penaltyPer5Minutes = 10000; // 10k per 5 menit
    const penalties = Math.ceil(diffMinutes / 5);
    
    return penalties * penaltyPer5Minutes;
};

// Get semua rental
const getAllRentals = (req, res) => {
    const query = `
        SELECT 
            r.id,
            r.customer_name,
            p.name as product_name,
            r.rental_hours,
            r.start_time,
            r.end_time,
            r.total_amount,
            r.status,
            r.return_time,
            r.penalty_amount,
            r.payment_status,
            CASE 
                WHEN r.status = 'playing' THEN 
                    TIMESTAMPDIFF(MINUTE, CURRENT_TIMESTAMP, r.end_time)
                ELSE 0
            END as remaining_minutes
        FROM rentals r
        JOIN products p ON r.product_id = p.id
        ORDER BY r.created_at DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Error database',
                error: err
            });
        }

        // Update penalty untuk yang masih bermain
        const updatePromises = results.map(rental => {
            if (rental.status === 'playing') {
                const currentPenalty = calculatePenalty(rental.end_time);
                // Update penalty di database
                return new Promise((resolve, reject) => {
                    if (currentPenalty > 0) {
                        const updateQuery = 'UPDATE rentals SET penalty_amount = ?, penalty_payment_status = ? WHERE id = ?';
                        db.query(updateQuery, [currentPenalty, 'pending', rental.id], (err) => {
                            if (err) reject(err);
                            rental.penalty_amount = currentPenalty;
                            rental.penalty_payment_status = 'pending';
                            resolve(rental);
                        });
                    } else {
                        // If no penalty, set amount to 0 and status to null
                        const updateQuery = 'UPDATE rentals SET penalty_amount = ?, penalty_payment_status = ? WHERE id = ?';
                        db.query(updateQuery, [0, null, rental.id], (err) => {
                            if (err) reject(err);
                            rental.penalty_amount = 0;
                            rental.penalty_payment_status = null;
                            resolve(rental);
                        });
                    }
                });
            }
            return Promise.resolve(rental);
        });

        // Tunggu semua updates selesai
        Promise.all(updatePromises)
            .then(rentalsWithUpdatedPenalty => {

                return res.status(200).json({
                    status: true,
                    message: 'Data rental berhasil diambil',
                    data: rentalsWithUpdatedPenalty
                });
            })
            .catch(error => {
                return res.status(500).json({
                    status: false,
                    message: 'Error updating penalties',
                    error: error
                });
            });
    });
};

// Get rental by ID
const getRentalById = (req, res) => {
    const { id } = req.params;
    
    const query = `
        SELECT 
            r.id,
            r.customer_name,
            p.name as product_name,
            r.rental_hours,
            r.start_time,
            r.end_time,
            r.total_amount,
            r.status,
            r.return_time,
            r.penalty_amount,
            r.payment_status,
            CASE 
                WHEN r.status = 'playing' THEN 
                    TIMESTAMPDIFF(MINUTE, CURRENT_TIMESTAMP, r.end_time)
                ELSE 0
            END as remaining_minutes
        FROM rentals r
        JOIN products p ON r.product_id = p.id
        WHERE r.id = ?
    `;
    
    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Error database',
                error: err
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'Data rental tidak ditemukan'
            });
        }

        const rental = results[0];
        if (rental.status === 'playing') {
            const currentPenalty = calculatePenalty(rental.end_time);
            if (currentPenalty > 0) {
                // Update penalty di database
                const updateQuery = 'UPDATE rentals SET penalty_amount = ? WHERE id = ?';
                db.query(updateQuery, [currentPenalty, rental.id], (err) => {
                    if (err) {
                        return res.status(500).json({
                            status: false,
                            message: 'Error updating penalty',
                            error: err
                        });
                    }
                    rental.penalty_amount = currentPenalty;
                    return res.status(200).json({
                        status: true,
                        message: 'Data rental berhasil diambil',
                        data: rental
                    });
                });
            } else {
                rental.penalty_amount = currentPenalty;
                return res.status(200).json({
                    status: true,
                    message: 'Data rental berhasil diambil',
                    data: rental
                });
            }
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data rental berhasil diambil',
                data: rental
            });
        }
    });
};

// Buat rental baru
const createRental = (req, res) => {
    const { product_id, customer_name, rental_hours } = req.body;

    if (!product_id || !customer_name || !rental_hours) {
        return res.status(400).json({
            status: false,
            message: 'Product, nama customer, dan jam sewa harus diisi'
        });
    }

    // Cek product exists dan dapatkan harganya
    const checkProduct = 'SELECT id, price, stock FROM products WHERE id = ?';
    db.query(checkProduct, [product_id], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Error database',
                error: err
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'Produk tidak ditemukan'
            });
        }

        if (results[0].stock < 1) {
            return res.status(400).json({
                status: false,
                message: 'Stok produk tidak tersedia'
            });
        }

        const product = results[0];
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + (rental_hours * 60 * 60 * 1000));
        const totalAmount = product.price * rental_hours;

        // Insert rental
        const insertQuery = `
            INSERT INTO rentals 
            (product_id, customer_name, rental_hours, start_time, end_time, total_amount, status, payment_status) 
            VALUES (?, ?, ?, ?, ?, ?, 'playing', 'pending')
        `;
        
        db.query(insertQuery, 
            [product_id, customer_name, rental_hours, startTime, endTime, totalAmount],
            (err, results) => {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        message: 'Error database',
                        error: err
                    });
                }

                // Update stock
                const updateStock = 'UPDATE products SET stock = stock - 1 WHERE id = ?';
                db.query(updateStock, [product_id]);

                return res.status(201).json({
                    status: true,
                    message: 'Rental berhasil dibuat',
                    data: {
                        id: results.insertId,
                        product_id,
                        customer_name,
                        rental_hours,
                        start_time: startTime,
                        end_time: endTime,
                        total_amount: totalAmount,
                        status: 'playing',
                        payment_status: 'pending'
                    }
                });
            }
        );
    });
};

// Return rental
const returnRental = (req, res) => {
    const { id } = req.params;
    const returnTime = new Date();

    // Get rental data
    const getQuery = `
        SELECT r.*, p.id as product_id 
        FROM rentals r 
        JOIN products p ON r.product_id = p.id 
        WHERE r.id = ?
    `;

    db.query(getQuery, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Error database',
                error: err
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'Data rental tidak ditemukan'
            });
        }

        const rental = results[0];

        if (rental.status === 'returned') {
            return res.status(400).json({
                status: false,
                message: 'Rental sudah dikembalikan sebelumnya'
            });
        }

        // Hitung denda
        const penaltyAmount = calculatePenalty(rental.end_time, returnTime);

        // Update rental
        const updateQuery = `
            UPDATE rentals 
            SET status = 'returned', 
                return_time = ?,
                penalty_amount = ?,
                penalty_payment_status = CASE WHEN ? > 0 THEN 'pending' ELSE NULL END
            WHERE id = ?
        `;

        db.query(updateQuery, [returnTime, penaltyAmount, penaltyAmount, id], (err) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Error database',
                    error: err
                });
            }

            // Update stock produk
            const updateStock = 'UPDATE products SET stock = stock + 1 WHERE id = ?';
            db.query(updateStock, [rental.product_id]);

            return res.status(200).json({
                status: true,
                message: 'Rental berhasil dikembalikan',
                data: {
                    id: rental.id,
                    return_time: returnTime,
                    penalty_amount: penaltyAmount
                }
            });
        });
    });
};

// Stop rental (mengubah status playing menjadi stop)
const stopRental = (req, res) => {
    const { id } = req.params;
    const stopTime = new Date();  // Waktu stop yang akan digunakan untuk return_time dan end_time

    // Get rental data with product info
    const getQuery = 'SELECT r.*, p.id as product_id FROM rentals r JOIN products p ON r.product_id = p.id WHERE r.id = ?';

    db.query(getQuery, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Error database',
                error: err
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'Data rental tidak ditemukan'
            });
        }

        const rental = results[0];

        if (rental.status !== 'playing') {
            return res.status(400).json({
                status: false,
                message: 'Rental tidak dalam status playing'
            });
        }

        // Update status, end_time, dan return_time
        const updateQuery = 'UPDATE rentals SET status = ?, end_time = ?, return_time = ? WHERE id = ?';

        db.query(updateQuery, ['returned', stopTime, stopTime, id], (err) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Error database',
                    error: err
                });
            }

            // Update stock produk
            const updateStock = 'UPDATE products SET stock = stock + 1 WHERE id = ?';
            db.query(updateStock, [rental.product_id]);

            return res.status(200).json({
                status: true,
                message: 'Status rental berhasil diubah menjadi returned',
                data: {
                    id: rental.id,
                    status: 'returned',
                    end_time: stopTime,
                    return_time: stopTime
                }
            });
        });
    });
};

module.exports = {
    getAllRentals,
    getRentalById,
    createRental,
    returnRental,
    stopRental
}; 