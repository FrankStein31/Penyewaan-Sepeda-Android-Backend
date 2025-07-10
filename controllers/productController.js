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
        (SELECT COUNT(*) FROM rentals r WHERE r.product_id = p.id AND r.status = 'playing') as active_rentals
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
    const { status } = req.body;

    if (!status || !['tersedia', 'disewa', 'rusak', 'hilang'].includes(status)) {
        return res.status(400).json({
            status: false,
            message: 'Status tidak valid'
        });
    }

    // Cek apakah produk sedang disewa
    if (status !== 'disewa') {
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
                    message: 'Produk sedang disewa, tidak bisa mengubah status'
                });
            }

            updateStatus();
        });
    } else {
        updateStatus();
    }

    function updateStatus() {
        const query = 'UPDATE products SET status = ? WHERE id = ?';
        db.query(query, [status, id], (err, results) => {
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
                message: 'Status produk berhasil diupdate',
                data: {
                    id: parseInt(id),
                    status
                }
            });
        });
    }
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
        (SELECT COUNT(*) FROM rentals r WHERE r.product_id = p.id AND r.status = 'playing') as active_rentals
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