const db = require('../Config/database.js');
const multer = require('multer');
const path = require('path');

// Konfigurasi multer untuk upload KTP
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/ktp/');
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
}).single('ktp_image');

const login = (req, res) => {
    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
        return res.status(400).json({
            status: false,
            message: 'Username dan password harus diisi'
        });
    }

    // Query ke database
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Error database',
                error: err
            });
        }

        // Cek hasil query
        if (results.length > 0) {
            return res.status(200).json({
                status: true,
                message: 'Login berhasil',
                data: {
                    id: results[0].id,
                    username: results[0].username,
                    level: results[0].level,
                    phone: results[0].phone,
                    nik: results[0].nik,
                    ktp_image: results[0].ktp_image,
                    address: results[0].address,
                    isAdmin: results[0].level === 'admin'
                }
            });
        } else {
            return res.status(401).json({
                status: false,
                message: 'Username atau password salah'
            });
        }
    });
};

// Tambah fungsi untuk mendapatkan semua user (hanya bisa diakses admin)
const getAllUsers = (req, res) => {
    const query = 'SELECT id, username, level, phone, nik, ktp_image, address, created_at FROM users';
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
            message: 'Data users berhasil diambil',
            data: results
        });
    });
};

const getUserById = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            status: false,
            message: 'ID harus diisi'
        });
    }

    const query = 'SELECT id, username, level, phone, nik, ktp_image, address, created_at FROM users WHERE id = ?';
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
                message: 'User tidak ditemukan'
            });
        }

        return res.status(200).json({
            status: true,
            message: 'Data user berhasil diambil',
            data: results[0]
        });
    });
};

const updatePassword = (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Validasi input
    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            status: false,
            message: 'Password lama dan password baru harus diisi'
        });
    }

    // Cek password lama
    const checkQuery = 'SELECT * FROM users WHERE id = ? AND password = ?';
    db.query(checkQuery, [id, currentPassword], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Error database',
                error: err
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                status: false,
                message: 'Password lama tidak sesuai'
            });
        }

        // Update password baru
        const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
        db.query(updateQuery, [newPassword, id], (err, results) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Error database',
                    error: err
                });
            }

            return res.status(200).json({
                status: true,
                message: 'Password berhasil diupdate'
            });
        });
    });
};

// Tambah fungsi untuk update profile
const updateProfile = (req, res) => {
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

        const { id } = req.params;
        const { phone, address, nik } = req.body;
        const ktp_image = req.file ? req.file.path.replace(/\\/g, '/') : null;

        // Validasi input
        if (!phone || !address || !nik) {
            return res.status(400).json({
                status: false,
                message: 'Nomor HP, alamat, dan NIK harus diisi'
            });
        }

        // Update profile
        let updateQuery = 'UPDATE users SET phone = ?, address = ?, nik = ?';
        let queryParams = [phone, address, nik];

        // Jika ada file KTP baru
        if (ktp_image) {
            updateQuery += ', ktp_image = ?';
            queryParams.push(ktp_image);
        }

        updateQuery += ' WHERE id = ?';
        queryParams.push(id);

        db.query(updateQuery, queryParams, (err, results) => {
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
                    message: 'User tidak ditemukan'
                });
            }

            return res.status(200).json({
                status: true,
                message: 'Profile berhasil diupdate',
                data: {
                    id: parseInt(id),
                    phone,
                    address,
                    nik,
                    ktp_image: ktp_image || undefined
                }
            });
        });
    });
};

module.exports = {
    login,
    getAllUsers,
    getUserById,
    updatePassword,
    updateProfile
};
