const db = require('../Config/database.js');

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
    const query = 'SELECT id, username, level, created_at FROM users';
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

    const query = 'SELECT id, username, level, created_at FROM users WHERE id = ?';
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

module.exports = {
    login,
    getAllUsers,
    getUserById,
    updatePassword
};
