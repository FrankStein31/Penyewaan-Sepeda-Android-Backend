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
        console.log('Debug - File upload:', file);
        if (file.mimetype.startsWith('image/')) {
            return cb(null, true);
        }
        cb(new Error('Hanya file gambar yang diperbolehkan'));
    }
}).single('ktp_image'); // Ubah dari 'image' ke 'ktp_image'

const register = (req, res) => {
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

        console.log('Debug - Request body:', req.body);
        console.log('Debug - Request file:', req.file);

        const { username, password, phone, address, nik } = req.body;
        const ktp_image = req.file ? req.file.path.replace(/\\/g, '/') : null;

        // Validasi input
        if (!username || !password || !phone || !address || !nik || !ktp_image) {
            return res.status(400).json({
                status: false,
                message: 'Semua field harus diisi'
            });
        }

        // Cek username exists
        const checkUsername = 'SELECT username FROM users WHERE username = ?';
        db.query(checkUsername, [username], (err, results) => {
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

            // Insert user baru
            const insertQuery = `
                INSERT INTO users 
                (username, password, phone, address, nik, ktp_image, level) 
                VALUES (?, ?, ?, ?, ?, ?, 'user')
            `;
            
            db.query(insertQuery, [username, password, phone, address, nik, ktp_image], (err, results) => {
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
                        phone,
                        address,
                        nik,
                        ktp_image,
                        level: 'user'
                    }
                });
            });
        });
    });
};

module.exports = {
    register
}; 