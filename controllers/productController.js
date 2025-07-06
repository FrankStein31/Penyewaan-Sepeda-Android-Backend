const db = require('../Config/database.js');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
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
        // Check if the file is an image by checking mimetype
        if (file.mimetype.startsWith('image/')) {
            return cb(null, true);
        }
        cb(new Error('Hanya file gambar yang diperbolehkan'));
    }
}).single('image');

// Get semua produk dengan nama kategori
const getAllProducts = (req, res) => {
    const query = `
        SELECT 
            p.id,
            p.name,
            p.image,
            p.description,
            p.price,
            p.stock,
            p.created_at,
            c.id as category_id,
            c.name as category_name
        FROM products p
        JOIN categories c ON p.category_id = c.id
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
        SELECT 
            p.id,
            p.name,
            p.image,
            p.description,
            p.price,
            p.stock,
            p.created_at,
            c.id as category_id,
            c.name as category_name
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

// Tambah produk baru
const createProduct = (req, res) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                status: false,
                message: 'Error saat upload file',
                error: err.message
            });
        } else if (err) {
            return res.status(400).json({
                status: false,
                message: err.message
            });
        }

        const { category_id, name, description, price, stock } = req.body;
        const image = req.file ? req.file.path.replace(/\\/g, '/') : null;

        // Validasi input
        if (!category_id || !name || !price) {
            return res.status(400).json({
                status: false,
                message: 'Kategori, nama, dan harga harus diisi'
            });
        }

        // Cek kategori exists
        const checkCategory = 'SELECT id FROM categories WHERE id = ?';
        db.query(checkCategory, [category_id], (err, results) => {
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
                    message: 'Kategori tidak ditemukan'
                });
            }

            // Insert produk
            const insertQuery = `
                INSERT INTO products 
                (category_id, name, image, description, price, stock) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            db.query(insertQuery, [category_id, name, image || null, description, price, stock || 0], (err, results) => {
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
                        category_id,
                        name,
                        image: image || null,
                        description,
                        price,
                        stock: stock || 0
                    }
                });
            });
        });
    });
};

// Update produk
const updateProduct = (req, res) => {
    const { id } = req.params;
    const { category_id, name, image, description, price, stock } = req.body;

    // Validasi input
    if (!category_id || !name || !price) {
        return res.status(400).json({
            status: false,
            message: 'Kategori, nama, dan harga harus diisi'
        });
    }

    // Cek kategori exists
    const checkCategory = 'SELECT id FROM categories WHERE id = ?';
    db.query(checkCategory, [category_id], (err, results) => {
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
                message: 'Kategori tidak ditemukan'
            });
        }

        // Update produk
        const updateQuery = `
            UPDATE products 
            SET category_id = ?, name = ?, image = ?, description = ?, price = ?, stock = ?
            WHERE id = ?
        `;
        
        db.query(updateQuery, [category_id, name, image || null, description, price, stock || 0, id], (err, results) => {
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
                    category_id,
                    name,
                    image: image || null,
                    description,
                    price,
                    stock: stock || 0
                }
            });
        });
    });
};

// Hapus produk
const deleteProduct = (req, res) => {
    const { id } = req.params;

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
};

// Upload foto produk
const uploadProductPhoto = (req, res) => {
    const { id } = req.params;

    // Cek apakah produk ada
    const checkProduct = 'SELECT id FROM products WHERE id = ?';
    db.query(checkProduct, [id], (err, results) => {
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

        // Proses upload
        upload(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({
                    status: false,
                    message: 'Error saat upload file',
                    error: err.message
                });
            } else if (err) {
                return res.status(400).json({
                    status: false,
                    message: err.message
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    status: false,
                    message: 'Tidak ada file yang diupload'
                });
            }

            // Update path foto di database
            const photoPath = req.file.path.replace(/\\/g, '/'); // Normalize path for Windows
            const updateQuery = 'UPDATE products SET image = ? WHERE id = ?';
            
            db.query(updateQuery, [photoPath, id], (err, results) => {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        message: 'Error database',
                        error: err
                    });
                }

                return res.status(200).json({
                    status: true,
                    message: 'Foto produk berhasil diupload',
                    data: {
                        id: parseInt(id),
                        image: photoPath
                    }
                });
            });
        });
    });
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductPhoto
}; 