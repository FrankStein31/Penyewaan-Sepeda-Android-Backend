const db = require('../Config/database.js');

const register = (req, res) => {
    const { username, password, level = 'user' } = req.body;

    // Validasi input
    if (!username || !password) {
        return res.status(400).json({
            status: false,
            message: 'Username dan password harus diisi'
        });
    }

    // Validasi level
    if (level && !['admin', 'user'].includes(level)) {
        return res.status(400).json({
            status: false,
            message: 'Level tidak valid. Level harus admin atau user'
        });
    }

    // Query untuk cek username sudah ada atau belum
    const checkQuery = 'SELECT id FROM users WHERE username = ?';
    db.query(checkQuery, [username], (err, results) => {
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
                message: 'Username sudah digunakan'
            });
        }

        // Query untuk insert user baru
        const insertQuery = 'INSERT INTO users (username, password, level) VALUES (?, ?, ?)';
        db.query(insertQuery, [username, password, level], (err, results) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Error database',
                    error: err
                });
            }

            return res.status(201).json({
                status: true,
                message: 'Registrasi berhasil',
                data: {
                    id: results.insertId,
                    username,
                    level
                }
            });
        });
    });
};

module.exports = {
    register
}; 