    const db = require('../Config/database.js');

    // Get semua kategori
    const getAllCategories = (req, res) => {
        const query = 'SELECT * FROM categories';
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
                message: 'Data kategori berhasil diambil',
                data: results
            });
        });
    };

    // Tambah kategori baru
    const createCategory = (req, res) => {
        const { name } = req.body;

        // Validasi input
        if (!name) {
            return res.status(400).json({
                status: false,
                message: 'Nama kategori harus diisi'
            });
        }

        // Query untuk cek nama kategori sudah ada atau belum
        const checkQuery = 'SELECT id FROM categories WHERE name = ?';
        db.query(checkQuery, [name], (err, results) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Error database',
                    error: err
                });
            }

            if (results.length > 0) {
                return res.status(400).json({
                    status: false,
                    message: 'Nama kategori sudah ada'
                });
            }

            // Query untuk insert kategori baru
            const insertQuery = 'INSERT INTO categories (name) VALUES (?)';
            db.query(insertQuery, [name], (err, results) => {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        message: 'Error database',
                        error: err
                    });
                }

                return res.status(201).json({
                    status: true,
                    message: 'Kategori berhasil ditambahkan',
                    data: {
                        id: results.insertId,
                        name
                    }
                });
            });
        });
    };

    // Update kategori
    const updateCategory = (req, res) => {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                status: false,
                message: 'Nama kategori harus diisi'
            });
        }

        const query = 'UPDATE categories SET name = ? WHERE id = ?';
        db.query(query, [name, id], (err, results) => {
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
                    message: 'Kategori tidak ditemukan'
                });
            }

            return res.status(200).json({
                status: true,
                message: 'Kategori berhasil diupdate',
                data: {
                    id: parseInt(id),
                    name
                }
            });
        });
    };

    // Hapus kategori
    const deleteCategory = (req, res) => {
        const { id } = req.params;

        const query = 'DELETE FROM categories WHERE id = ?';
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
                    message: 'Kategori tidak ditemukan'
                });
            }

            return res.status(200).json({
                status: true,
                message: 'Kategori berhasil dihapus'
            });
        });
    };

    module.exports = {
        getAllCategories,
        createCategory,
        updateCategory,
        deleteCategory
    }; 