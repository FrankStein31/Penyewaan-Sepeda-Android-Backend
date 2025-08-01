const db = require('../Config/database.js');
const multer = require('multer');
const path = require('path');

// Konfigurasi multer untuk upload gambar produk
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/products/');
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
}).single('image');

// Get semua produk
const getAllProducts = (req, res) => {
    const query = `
        SELECT p.*, c.name as category_name,
        (SELECT COUNT(*) FROM rentals r WHERE r.product_id = p.id AND r.status = 'playing') as active_rentals,
        p.stock as total_stock,
        (p.stock - 
            (SELECT COUNT(*) FROM rentals r WHERE r.product_id = p.id AND r.status = 'playing') - 
            p.stock_damaged - 
            p.stock_lost
        ) as stock_available,
        (SELECT COUNT(*) FROM rentals r WHERE r.product_id = p.id AND r.status = 'playing') as disewa,
        p.stock_damaged as rusak,
        p.stock_lost as hilang
        FROM products p
        JOIN categories c ON p.category_id = c.id
        ORDER BY p.created_at DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Error database',
                error: err
            });
        }

        // Update stok_rented dan stock_available di database
        results.forEach(product => {
            product.disewa = parseInt(product.disewa);
            product.stock_available = parseInt(product.stock_available);
            product.stock = parseInt(product.total_stock);

            // Update database
            db.query(
                'UPDATE products SET stock_rented = ?, stock_available = ? WHERE id = ?',
                [product.disewa, product.stock_available, product.id]
            );
        });

        return res.status(200).json({
            status: true,
            message: 'Data produk berhasil diambil',
            data: results
        });
    });
};

// Get produk by ID
const getProductById = (req, res) => {
    const { id } = req.params;
    
    const query = `
        SELECT p.*, c.name as category_name,
        (SELECT COUNT(*) FROM rentals r WHERE r.product_id = p.id AND r.status = 'playing') as active_rentals
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
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
                message: 'Produk tidak ditemukan'
            });
        }

        return res.status(200).json({
            status: true,
            message: 'Data produk berhasil diambil',
            data: results[0]
        });
    });
};

// Create produk baru
const createProduct = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                status: false,
                message: err.message
            });
        }

        const { name, category_id, description, price, stock } = req.body;
        const image = req.file ? req.file.path.replace(/\\/g, '/') : null;

        if (!name || !category_id || !price || !stock) {
            return res.status(400).json({
                status: false,
                message: 'Nama, kategori, harga, dan stok harus diisi'
            });
        }

        const query = 'INSERT INTO products SET ?';
        const data = {
            name,
            category_id,
            description,
            price,
            stock,
            image,
            status: 'tersedia'
        };
            
        db.query(query, data, (err, results) => {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        message: 'Error database',
                        error: err
                    });
                }

                return res.status(201).json({
                    status: true,
                    message: 'Produk berhasil ditambahkan',
                    data: {
                        id: results.insertId,
                    ...data
                    }
            });
        });
    });
};

// Update produk
const updateProduct = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                status: false,
                message: err.message
            });
        }

        const { id } = req.params;
        const { name, category_id, description, price, stock, status } = req.body;
        const image = req.file ? req.file.path.replace(/\\/g, '/') : null;

        let updateFields = {};
        if (name) updateFields.name = name;
        if (category_id) updateFields.category_id = category_id;
        if (description) updateFields.description = description;
        if (price) updateFields.price = price;
        if (stock) updateFields.stock = stock;
        if (status) updateFields.status = status;
        if (image) updateFields.image = image;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                status: false,
                message: 'Tidak ada data yang diupdate'
            });
        }

        const query = 'UPDATE products SET ? WHERE id = ?';
        db.query(query, [updateFields, id], (err, results) => {
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
                    message: 'Produk tidak ditemukan'
                });
            }

            return res.status(200).json({
                status: true,
                message: 'Produk berhasil diupdate',
                data: {
                    id: parseInt(id),
                    ...updateFields
                }
            });
        });
    });
};

// Delete produk
const deleteProduct = (req, res) => {
    const { id } = req.params;

    // Cek apakah produk sedang disewa
    const checkRental = `
        SELECT COUNT(*) as active_rentals 
        FROM rentals 
        WHERE product_id = ? AND status = 'playing'
    `;

    db.query(checkRental, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Error database',
                error: err
            });
        }

        if (results[0].active_rentals > 0) {
            return res.status(400).json({
                status: false,
                message: 'Produk sedang disewa, tidak bisa dihapus'
            });
        }

    const query = 'DELETE FROM products WHERE id = ?';
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
                message: 'Produk tidak ditemukan'
            });
        }

        return res.status(200).json({
            status: true,
            message: 'Produk berhasil dihapus'
            });
        });
    });
};

// Update status produk
const updateProductStatus = (req, res) => {
    const { id } = req.params;
    const { status, quantity } = req.body;

    if (!status || !['tersedia', 'disewa', 'rusak', 'hilang'].includes(status)) {
        return res.status(400).json({
            status: false,
            message: 'Status tidak valid'
        });
    }

    if (quantity === undefined || quantity < 0) {
        return res.status(400).json({
            status: false,
            message: 'Jumlah tidak boleh negatif'
        });
    }

    // Ambil data produk dan rental aktif
    const query = `
        SELECT p.*, 
        (SELECT COUNT(*) FROM rentals r WHERE r.product_id = p.id AND r.status = 'playing') as active_rentals
        FROM products p 
        WHERE p.id = ?
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
                message: 'Produk tidak ditemukan'
            });
        }

        const product = results[0];
        const activeRentals = parseInt(product.active_rentals);
        const currentStock = {
            available: product.stock_available,
            rented: activeRentals,
            damaged: product.stock_damaged,
            lost: product.stock_lost
        };

        // Validasi total stok
        const totalStock = product.stock;
        let newStockStatus = {...currentStock};

        // Update stok berdasarkan status
        switch(status) {
            case 'tersedia':
                if (quantity > totalStock) {
                return res.status(400).json({
                    status: false,
                        message: 'Jumlah melebihi total stok'
                });
                }
                newStockStatus.available = quantity;
                break;
            case 'disewa':
                return res.status(400).json({
                    status: false,
                    message: 'Status disewa diupdate otomatis dari tabel rental'
                });
            case 'rusak':
                newStockStatus.damaged = quantity;
                newStockStatus.available = Math.max(0, product.stock_available - quantity);
                break;
            case 'hilang':
                newStockStatus.lost = quantity;
                newStockStatus.available = Math.max(0, product.stock_available - quantity);
                break;
        }

        // Validasi total stok setelah perubahan
        const newTotalStock = Object.values(newStockStatus).reduce((a, b) => a + b, 0);
        if (newTotalStock > totalStock) {
                return res.status(400).json({
                    status: false,
                message: 'Total stok setelah perubahan melebihi stok awal'
                });
            }

        // Update database
        const updateQuery = `
            UPDATE products 
            SET stock_available = ?,
                stock_damaged = ?,
                stock_lost = ?
            WHERE id = ?
        `;
            
        db.query(
            updateQuery, 
            [
                newStockStatus.available,
                newStockStatus.damaged,
                newStockStatus.lost,
                id
            ],
            (err, results) => {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        message: 'Error database',
                        error: err
                    });
                }

                // Jika status rusak atau hilang, hitung denda untuk rental aktif
                if (status === 'rusak' || status === 'hilang') {
                    const getActiveRentals = `
                        SELECT r.id, r.total_amount, p.price, r.user_id
                        FROM rentals r
                        JOIN products p ON r.product_id = p.id
                        WHERE r.product_id = ? AND r.status = 'playing'
                    `;

                    db.query(getActiveRentals, [id], (err, rentalResults) => {
                        if (err) {
                            console.error('Error getting active rentals:', err);
                            return;
                        }

                        rentalResults.forEach(rental => {
                            let damageAmount = 0;
                            let lostAmount = 0;
                            let newRentalStatus = 'returned';

                            if (status === 'rusak') {
                                damageAmount = rental.price * 2; // Denda kerusakan = 2x harga sewa
                                newRentalStatus = 'damaged';
                            } else if (status === 'hilang') {
                                lostAmount = rental.price * 10; // Denda kehilangan = 10x harga sewa
                                newRentalStatus = 'lost';
                            }

                            // Update rental dengan denda
                            const updateRental = `
                                UPDATE rentals 
                                SET status = ?,
                                    damage_penalty = ?,
                                    lost_penalty = ?,
                                    return_time = NOW()
                                WHERE id = ?
                            `;

                            db.query(updateRental, [
                                newRentalStatus,
                                damageAmount,
                                lostAmount,
                                rental.id
                            ], (err) => {
                                if (err) {
                                    console.error('Error updating rental penalty:', err);
                                } else {
                                    console.log(`Updated rental ${rental.id} with ${status} penalty: damage=${damageAmount}, lost=${lostAmount}`);
                                    
                                    // Buat notifikasi untuk user
                                    const notification = {
                                        user_id: rental.user_id,
                                        rental_id: rental.id,
                                        title: status === 'rusak' ? 'Denda Kerusakan' : 'Denda Kehilangan',
                                        message: status === 'rusak' 
                                            ? `Sepeda mengalami kerusakan. Denda kerusakan: Rp${damageAmount}`
                                            : `Sepeda hilang. Denda kehilangan: Rp${lostAmount}`,
                                        type: 'damage'
                                    };

                                    const insertNotif = 'INSERT INTO notifications SET ?';
                                    db.query(insertNotif, notification, (err) => {
                                        if (err) {
                                            console.error('Error creating damage/lost notification:', err);
                                        } else {
                                            console.log(`Created notification for rental ${rental.id}`);
                                        }
                                    });

                                    // Tambahkan laporan denda ke tabel rental_reports
                                    const reportType = status === 'rusak' ? 'damage' : 'lost';
                                    const reportAmount = status === 'rusak' ? damageAmount : lostAmount;
                                    const reportDescription = status === 'rusak' 
                                        ? 'Denda kerusakan sepeda' 
                                        : 'Denda kehilangan sepeda';

                                    const insertReport = `
                                        INSERT INTO rental_reports 
                                        (rental_id, report_type, amount, description) 
                                        VALUES (?, ?, ?, ?)
                                    `;

                                    db.query(insertReport, [
                                        rental.id,
                                        reportType,
                                        reportAmount,
                                        reportDescription
                                    ], (err) => {
                                        if (err) {
                                            console.error('Error creating rental report:', err);
                                        } else {
                                            console.log(`Created rental report for ${reportType} penalty: Rp${reportAmount}`);
                                        }
                                    });
                                }
                            });
                        });
                    });
                }

                return res.status(200).json({
                    status: true,
                    message: 'Status dan stok produk berhasil diupdate',
                    data: {
                        id: parseInt(id),
                        stock_status: newStockStatus
                    }
                });
            }
        );
    });
};

// Get produk berdasarkan status
const getProductsByStatus = (req, res) => {
    const { status } = req.params;

    if (!['tersedia', 'disewa', 'rusak', 'hilang'].includes(status)) {
        return res.status(400).json({
            status: false,
            message: 'Status tidak valid'
        });
    }

    const query = `
        SELECT p.*, c.name as category_name,
        (SELECT COUNT(*) FROM rentals r WHERE r.product_id = p.id AND r.status = 'playing') as active_rentals,
        p.stock_available as tersedia,
        (SELECT COUNT(*) FROM rentals r WHERE r.product_id = p.id AND r.status = 'playing') as disewa,
        p.stock_damaged as rusak,
        p.stock_lost as hilang
        FROM products p 
        JOIN categories c ON p.category_id = c.id
        WHERE p.status = ?
        ORDER BY p.created_at DESC
    `;
            
    db.query(query, [status], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Error database',
                error: err
            });
        }

        // Update stok_rented berdasarkan active_rentals
        results.forEach(product => {
            product.disewa = parseInt(product.disewa);
            if (product.disewa !== product.stock_rented) {
                // Update stok_rented di database
                db.query(
                    'UPDATE products SET stock_rented = ? WHERE id = ?',
                    [product.disewa, product.id]
                );
            }
        });

        return res.status(200).json({
            status: true,
            message: 'Data produk berhasil diambil',
            data: results
        });
    });
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus,
    getProductsByStatus
}; 