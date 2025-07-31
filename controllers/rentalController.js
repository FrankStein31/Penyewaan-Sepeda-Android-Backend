const db = require('../Config/database.js');
const multer = require('multer');
const path = require('path');

// Konfigurasi multer untuk upload bukti kerusakan
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/damage_proofs/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            return cb(null, true);
        }
        cb(new Error('Hanya file gambar yang diperbolehkan'));
    }
}).single('damage_proof');

// Get semua rental dengan detail
const getAllRentals = (req, res) => {
    const query = `
        SELECT 
            r.id,
            r.rental_hours,
            r.start_time,
            r.end_time,
            r.total_amount,
            r.status,
            r.return_time,
            r.penalty_amount,
            r.damage_penalty,
            r.lost_penalty,
            r.payment_status,
            r.penalty_payment_status,
            r.damage_notes,
            r.damage_proof,
            p.name as product_name,
            p.status as product_status,
            u.username as user_name,
            u.phone as user_phone,
            u.nik as user_nik,
            u.address as user_address,
            u.ktp_image as user_ktp_image,
            u.profile_image as user_profile_image,
            CASE 
                WHEN r.status = 'playing' THEN 
                    TIMESTAMPDIFF(MINUTE, CURRENT_TIMESTAMP, r.end_time)
                ELSE 0
            END as remaining_minutes
        FROM rentals r
        JOIN products p ON r.product_id = p.id
        JOIN users u ON r.user_id = u.id
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
                return res.status(200).json({
                    status: true,
                    message: 'Data rental berhasil diambil',
            data: results
            });
    });
};

// Get rental by ID dengan detail
const getRentalById = (req, res) => {
    const { id } = req.params;
    
    const query = `
        SELECT 
            r.id,
            r.rental_hours,
            r.start_time,
            r.end_time,
            r.total_amount,
            r.status,
            r.return_time,
            r.penalty_amount,
            r.damage_penalty,
            r.lost_penalty,
            r.payment_status,
            r.penalty_payment_status,
            r.damage_notes,
            r.damage_proof,
            p.name as product_name,
            p.status as product_status,
            u.username as user_name,
            u.phone as user_phone,
            u.nik as user_nik,
            u.address as user_address,
            u.ktp_image as user_ktp_image,
            u.profile_image as user_profile_image,
            CASE 
                WHEN r.status = 'playing' THEN 
                    TIMESTAMPDIFF(MINUTE, CURRENT_TIMESTAMP, r.end_time)
                ELSE 0
            END as remaining_minutes
        FROM rentals r
        JOIN products p ON r.product_id = p.id
        JOIN users u ON r.user_id = u.id
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

                    return res.status(200).json({
                        status: true,
                        message: 'Data rental berhasil diambil',
            data: results[0]
            });
    });
};

// Buat rental baru
const createRental = (req, res) => {
    const { product_id, user_id, rental_hours } = req.body;

    if (!product_id || !user_id || !rental_hours) {
        return res.status(400).json({
            status: false,
            message: 'Product, user, dan jam sewa harus diisi'
        });
    }

    // Cek user blacklist
    const checkUser = 'SELECT is_blacklisted FROM users WHERE id = ?';
    db.query(checkUser, [user_id], (err, userResults) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Error database',
                error: err
            });
        }

        if (userResults.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'User tidak ditemukan'
            });
        }

        if (userResults[0].is_blacklisted) {
            return res.status(403).json({
                status: false,
                message: 'User dalam daftar blacklist'
            });
        }

        // Cek product exists dan status
        const checkProduct = 'SELECT id, price, stock, status FROM products WHERE id = ?';
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

        const product = results[0];
            if (product.status !== 'tersedia') {
                return res.status(400).json({
                    status: false,
                    message: `Sepeda tidak tersedia (${product.status})`
                });
            }

            if (product.stock < 1) {
            return res.status(400).json({
                status: false,
                message: 'Stok produk tidak tersedia'
            });
        }

            // Ambil username user
            const getUser = 'SELECT username FROM users WHERE id = ?';
            db.query(getUser, [user_id], (err, userRows) => {
                if (err || userRows.length === 0) {
                    return res.status(500).json({
                        status: false,
                        message: 'Error ambil user',
                        error: err
                    });
                }
                const customer_name = userRows[0].username;

        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + (rental_hours * 60 * 60 * 1000));
        const totalAmount = product.price * rental_hours;

                // Insert rental (isi customer_name)
        const insertQuery = `
            INSERT INTO rentals 
                    (product_id, user_id, customer_name, rental_hours, start_time, end_time, total_amount, status, payment_status) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, 'playing', 'pending')
        `;
                db.query(insertQuery, [product_id, user_id, customer_name, rental_hours, startTime, endTime, totalAmount], (err, results) => {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        message: 'Error database',
                        error: err
                    });
                }

                    // Update stock_available (stok tersedia), stock (total) tidak berubah
                    const updateProduct = 'UPDATE products SET stock_available = stock_available - 1 WHERE id = ? AND stock_available > 0';
                    db.query(updateProduct, [product_id], (err, result) => {
                        if (err) {
                            return res.status(500).json({
                                status: false,
                                message: 'Error updating product stock_available',
                                error: err
                            });
                        }
                        if (result.affectedRows === 0) {
                            return res.status(400).json({
                                status: false,
                                message: 'Stok tersedia habis, tidak bisa disewa'
                            });
                        }

                return res.status(201).json({
                    status: true,
                    message: 'Rental berhasil dibuat',
                    data: {
                        id: results.insertId,
                        product_id,
                                user_id,
                        rental_hours,
                        start_time: startTime,
                        end_time: endTime,
                                total_amount: totalAmount
                    }
                        });
                    });
                });
            });
        });
    });
};

// Return rental
const returnRental = (req, res) => {
    const { id } = req.params;
    const { damage_notes, product_status } = req.body;

    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                status: false,
                message: err.message
            });
        }

    const returnTime = new Date();
        const damage_proof = req.file ? req.file.path.replace(/\\/g, '/') : null;

    // Get rental data
        const getRental = `
            SELECT r.*, p.price 
        FROM rentals r 
        JOIN products p ON r.product_id = p.id 
        WHERE r.id = ?
    `;

        db.query(getRental, [id], (err, results) => {
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
                    message: 'Rental tidak ditemukan'
            });
        }

        const rental = results[0];
            if (rental.status !== 'playing') {
            return res.status(400).json({
                status: false,
                    message: 'Rental sudah selesai'
            });
        }

            // Hitung denda keterlambatan (per menit)
            const endTime = new Date(rental.end_time);
            let penaltyAmount = 0;
            if (returnTime > endTime) {
                const diffMinutes = Math.ceil((returnTime - endTime) / (1000 * 60));
                penaltyAmount = diffMinutes * 1000; // Denda per menit = Rp1.000
            }

            // Set status dan denda berdasarkan kondisi
            let newStatus = 'returned';
            let damageAmount = 0;
            let lostAmount = 0;
            let productNewStatus = 'tersedia';

            if (product_status === 'rusak') {
                newStatus = 'damaged';
                damageAmount = rental.price * 2; // Denda kerusakan = 2x harga sewa
                productNewStatus = 'rusak';
            } else if (product_status === 'hilang') {
                newStatus = 'lost';
                lostAmount = rental.price * 10; // Denda kehilangan = 10x harga sewa
                productNewStatus = 'hilang';
            }

        // Update rental
            const updateRental = `
            UPDATE rentals 
                SET status = ?, 
                return_time = ?,
                penalty_amount = ?,
                    damage_penalty = ?,
                    lost_penalty = ?,
                    damage_notes = ?,
                    damage_proof = ?
            WHERE id = ?
        `;

            db.query(updateRental, [
                newStatus, 
                returnTime,
                penaltyAmount,
                damageAmount,
                lostAmount,
                damage_notes,
                damage_proof,
                id
            ], (err) => {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        message: 'Error updating rental',
                        error: err
                    });
                }

                // Update product status
                const updateProduct = 'UPDATE products SET status = ?, stock = stock + 1 WHERE id = ?';
                db.query(updateProduct, [productNewStatus, rental.product_id], (err) => {
                    if (err) {
                        return res.status(500).json({
                            status: false,
                            message: 'Error updating product status',
                            error: err
                        });
                    }

                    // Create report if needed
                    if (penaltyAmount > 0 || damageAmount > 0 || lostAmount > 0) {
                        const reports = [];
                        
                        if (penaltyAmount > 0) {
                            reports.push([id, 'late', penaltyAmount, 'Denda keterlambatan', null]);
                        }
                        if (damageAmount > 0) {
                            reports.push([id, 'damage', damageAmount, damage_notes, damage_proof]);
                        }
                        if (lostAmount > 0) {
                            reports.push([id, 'lost', lostAmount, 'Sepeda hilang', null]);
                        }

                        const insertReports = `
                            INSERT INTO rental_reports 
                            (rental_id, report_type, amount, description, proof_image)
                            VALUES ?
                        `;

                        db.query(insertReports, [reports], (err) => {
                            if (err) {
                                console.error('Error creating reports:', err);
                            }
                        });

                        // Create notification
                        const notification = {
                            user_id: rental.user_id,
                            rental_id: id,
                            title: 'Denda Rental',
                            message: `Anda memiliki denda: ${
                                penaltyAmount > 0 ? `\nKeterlambatan: Rp${penaltyAmount}` : ''
                            }${
                                damageAmount > 0 ? `\nKerusakan: Rp${damageAmount}` : ''
                            }${
                                lostAmount > 0 ? `\nKehilangan: Rp${lostAmount}` : ''
                            }`,
                            type: 'late'
                        };

                        const insertNotif = `
                            INSERT INTO notifications
                            SET ?
                        `;

                        db.query(insertNotif, notification, (err) => {
                            if (err) {
                                console.error('Error creating notification:', err);
                            }
                        });
                    }

                    return res.status(200).json({
                        status: true,
                        message: 'Rental berhasil dikembalikan',
                        data: {
                            id: parseInt(id),
                            return_time: returnTime,
                            penalty_amount: penaltyAmount,
                            damage_penalty: damageAmount,
                            lost_penalty: lostAmount,
                            total_penalty: penaltyAmount + damageAmount + lostAmount
                        }
                    });
                });
            });
        });
    });
};

// Get rental reports
const getRentalReports = (req, res) => {
    const query = `
        SELECT 
            rr.*,
            r.user_id,
            u.username,
            p.name as product_name
        FROM rental_reports rr
        JOIN rentals r ON rr.rental_id = r.id
        JOIN users u ON r.user_id = u.id
        JOIN products p ON r.product_id = p.id
        ORDER BY rr.created_at DESC
    `;

    db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Error database',
                    error: err
                });
            }

            return res.status(200).json({
                status: true,
            message: 'Data report berhasil diambil',
            data: results
        });
    });
};

// Get user notifications
const getUserNotifications = (req, res) => {
    const { user_id } = req.params;

    const query = `
        SELECT * FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(query, [user_id], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Error database',
                error: err
            });
        }

        return res.status(200).json({
            status: true,
            message: 'Data notifikasi berhasil diambil',
            data: results
        });
    });
};

// Mark notification as read
const markNotificationRead = (req, res) => {
    const { id } = req.params;

    const query = 'UPDATE notifications SET is_read = 1 WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Error database',
                error: err
            });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                status: false,
                message: 'Notifikasi tidak ditemukan'
            });
        }

        return res.status(200).json({
            status: true,
            message: 'Notifikasi berhasil ditandai telah dibaca'
            });
    });
};

// Get rentals by user_id
const getRentalsByUserId = (req, res) => {
    const { user_id } = req.params;
    const query = `
        SELECT 
            r.id,
            r.rental_hours,
            r.start_time,
            r.end_time,
            r.total_amount,
            r.status,
            r.return_time,
            r.penalty_amount,
            r.damage_penalty,
            r.lost_penalty,
            r.payment_status,
            r.penalty_payment_status,
            r.damage_notes,
            r.damage_proof,
            p.name as product_name,
            p.status as product_status
        FROM rentals r
        JOIN products p ON r.product_id = p.id
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC
    `;
    db.query(query, [user_id], (err, results) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Error database',
                    error: err
                });
            }
            return res.status(200).json({
                status: true,
            message: 'Data rental user berhasil diambil',
            data: results
        });
    });
};

// Ambil detail rental by id, join ke users
const getRentalDetail = (req, res) => {
  const rentalId = req.params.id;
  const query = `
    SELECT r.*, p.name AS product_name, u.username, u.phone, u.nik, u.address, u.ktp_image, u.level
    FROM rentals r
    JOIN products p ON r.product_id = p.id
    JOIN users u ON r.user_id = u.id
    WHERE r.id = ?
  `;
  db.query(query, [rentalId], (err, results) => {
    if (err) {
      return res.status(500).json({ status: false, message: 'Error database', error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ status: false, message: 'Rental tidak ditemukan' });
    }
    return res.json({ status: true, data: results[0] });
    });
};

module.exports = {
    getAllRentals,
    getRentalById,
    createRental,
    returnRental,
    getRentalReports,
    getUserNotifications,
    markNotificationRead,
    getRentalsByUserId,
    getRentalDetail
}; 