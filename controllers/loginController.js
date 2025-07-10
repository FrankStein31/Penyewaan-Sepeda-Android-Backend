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

// Login
const login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            status: false,
            message: 'Username dan password harus diisi'
        });
    }

    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
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
                message: 'Username atau password salah'
            });
        }

        const user = results[0];
        if (user.is_blacklisted) {
            return res.status(403).json({
                status: false,
                message: 'Akun Anda telah di-blacklist',
                blacklist_reason: user.blacklist_reason,
                blacklist_date: user.blacklist_date
            });
        }

        return res.status(200).json({
            status: true,
            message: 'Login berhasil',
            data: {
                id: user.id,
                username: user.username,
                level: user.level,
                phone: user.phone,
                nik: user.nik,
                ktp_image: user.ktp_image,
                address: user.address
            }
        });
    });
};

// Get user by ID
const getUserById = (req, res) => {
    const { id } = req.params;

    const query = 'SELECT * FROM users WHERE id = ?';
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

        const user = results[0];
        return res.status(200).json({
            status: true,
            message: 'Data user berhasil diambil',
            data: {
                id: user.id,
                username: user.username,
                level: user.level,
                phone: user.phone,
                nik: user.nik,
                ktp_image: user.ktp_image,
                address: user.address,
                is_blacklisted: user.is_blacklisted,
                blacklist_reason: user.blacklist_reason,
                blacklist_date: user.blacklist_date
            }
        });
    });
};

// Update profile
const updateProfile = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                status: false,
                message: err.message
            });
        }

        const { id } = req.params;
        const { phone, nik, address } = req.body;
        const ktp_image = req.file ? req.file.path.replace(/\\/g, '/') : null;

        let updateFields = {};
        if (phone) updateFields.phone = phone;
        if (nik) updateFields.nik = nik;
        if (address) updateFields.address = address;
        if (ktp_image) updateFields.ktp_image = ktp_image;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                status: false,
                message: 'Tidak ada data yang diupdate'
            });
        }

        const query = 'UPDATE users SET ? WHERE id = ?';
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
                    message: 'User tidak ditemukan'
                });
            }

            return res.status(200).json({
                status: true,
                message: 'Profile berhasil diupdate',
                data: {
                    id: parseInt(id),
                    ...updateFields
                }
            });
        });
    });
};

// Blacklist user
const blacklistUser = (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
        return res.status(400).json({
            status: false,
            message: 'Alasan blacklist harus diisi'
        });
    }

    const query = `
        UPDATE users 
        SET is_blacklisted = 1,
            blacklist_reason = ?,
            blacklist_date = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    db.query(query, [reason, id], (err, results) => {
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

        // Create notification for user
        const notification = {
            user_id: id,
            title: 'Akun Di-blacklist',
            message: `Akun Anda telah di-blacklist dengan alasan: ${reason}`,
            type: 'system'
        };

        const insertNotif = 'INSERT INTO notifications SET ?';
        db.query(insertNotif, notification, (err) => {
            if (err) {
                console.error('Error creating blacklist notification:', err);
            }
        });

        return res.status(200).json({
            status: true,
            message: 'User berhasil di-blacklist',
            data: {
                id: parseInt(id),
                reason,
                blacklist_date: new Date()
            }
        });
    });
};

// Remove user from blacklist
const removeBlacklist = (req, res) => {
    const { id } = req.params;

    const query = `
        UPDATE users 
        SET is_blacklisted = 0,
            blacklist_reason = NULL,
            blacklist_date = NULL
        WHERE id = ?
    `;

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
                message: 'User tidak ditemukan'
            });
        }

        // Create notification for user
        const notification = {
            user_id: id,
            title: 'Blacklist Dihapus',
            message: 'Akun Anda telah dihapus dari daftar blacklist',
            type: 'system'
        };

        const insertNotif = 'INSERT INTO notifications SET ?';
        db.query(insertNotif, notification, (err) => {
            if (err) {
                console.error('Error creating unblacklist notification:', err);
            }
        });

        return res.status(200).json({
            status: true,
            message: 'User berhasil dihapus dari blacklist'
        });
    });
};

// Get blacklisted users
const getBlacklistedUsers = (req, res) => {
    const query = `
        SELECT id, username, phone, nik, address, blacklist_reason, blacklist_date
        FROM users
        WHERE is_blacklisted = 1
        ORDER BY blacklist_date DESC
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
            message: 'Data user blacklist berhasil diambil',
            data: results
        });
    });
};

// Get all users
const getAllUsers = (req, res) => {
    const query = 'SELECT id, username, level, phone, nik, ktp_image, address, is_blacklisted, blacklist_reason, blacklist_date, created_at FROM users ORDER BY created_at DESC';
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
            message: 'Data user berhasil diambil',
            data: results
        });
    });
};

module.exports = {
    login,
    getUserById,
    updateProfile,
    blacklistUser,
    removeBlacklist,
    getBlacklistedUsers,
    getAllUsers
};
