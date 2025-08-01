const db = require('../Config/database.js');

// Check rentals yang akan habis dan buat notifikasi
const checkRentalTimeNotifications = () => {
    const query = `
        SELECT 
            r.id,
            r.user_id,
            r.end_time,
            p.name as product_name,
            TIMESTAMPDIFF(MINUTE, CURRENT_TIMESTAMP, r.end_time) as remaining_minutes
        FROM rentals r
        JOIN products p ON r.product_id = p.id
        WHERE r.status = 'playing'
        AND TIMESTAMPDIFF(MINUTE, CURRENT_TIMESTAMP, r.end_time) <= 30
        AND TIMESTAMPDIFF(MINUTE, CURRENT_TIMESTAMP, r.end_time) > 0
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error checking rental times:', err);
            return;
        }

        results.forEach(rental => {
            // Buat notifikasi 30 menit sebelum habis
            if (rental.remaining_minutes <= 30) {
                const notification = {
                    user_id: rental.user_id,
                    rental_id: rental.id,
                    title: 'Waktu Sewa Akan Habis',
                    message: `Sewa ${rental.product_name} akan berakhir dalam ${rental.remaining_minutes} menit. Mohon segera kembalikan untuk menghindari denda.`,
                    type: 'warning'
                };

                const insertNotif = 'INSERT INTO notifications SET ?';
                db.query(insertNotif, notification, (err) => {
                    if (err) {
                        console.error('Error creating time warning notification:', err);
                    }
                });
            }
        });
    });
};

// Check rentals yang sudah lewat waktu dan buat notifikasi denda
const checkLateRentalNotifications = () => {
    const query = `
        SELECT 
            r.id,
            r.user_id,
            r.end_time,
            p.name as product_name,
            p.price,
            r.penalty_payment_status,
            TIMESTAMPDIFF(MINUTE, r.end_time, CURRENT_TIMESTAMP) as late_minutes
        FROM rentals r
        JOIN products p ON r.product_id = p.id
        WHERE r.status = 'playing'
        AND CURRENT_TIMESTAMP > r.end_time
        AND (r.penalty_payment_status IS NULL OR r.penalty_payment_status = 'pending')
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error checking late rentals:', err);
            return;
        }

        results.forEach(rental => {
            // Hentikan perhitungan denda jika pembayaran sudah dimulai
            if (rental.penalty_payment_status === 'paid') {
                console.log(`Rental ${rental.id}: Denda sudah dibayar, skip perhitungan`);
                return;
            }

            const penaltyAmount = rental.late_minutes * 1000; // Rp1.000 per menit

            const notification = {
                user_id: rental.user_id,
                rental_id: rental.id,
                title: 'Denda Keterlambatan',
                message: `Anda terlambat mengembalikan ${rental.product_name} selama ${rental.late_minutes} menit. Denda: Rp${penaltyAmount}`,
                type: 'late'
            };

            const insertNotif = 'INSERT INTO notifications SET ?';
            db.query(insertNotif, notification, (err) => {
                if (err) {
                    console.error('Error creating late penalty notification:', err);
                }
            });

            // Update denda di tabel rental hanya jika belum dibayar
            const updateRental = 'UPDATE rentals SET penalty_amount = ? WHERE id = ? AND (penalty_payment_status IS NULL OR penalty_payment_status = "pending")';
            db.query(updateRental, [penaltyAmount, rental.id], (err) => {
                if (err) {
                    console.error('Error updating rental penalty:', err);
                } else {
                    console.log(`Updated penalty for rental ${rental.id}: Rp${penaltyAmount}`);
                }
            });
        });
    });
};

// Get notifikasi user
const getUserNotifications = (req, res) => {
    const { user_id } = req.params;

    const query = `
        SELECT 
            n.*,
            r.end_time,
            p.name as product_name
        FROM notifications n
        LEFT JOIN rentals r ON n.rental_id = r.id
        LEFT JOIN products p ON r.product_id = p.id
        WHERE n.user_id = ?
        ORDER BY n.created_at DESC
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

// Mark notifikasi sebagai dibaca
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

// Get unread notification count
const getUnreadCount = (req, res) => {
    const { user_id } = req.params;

    const query = 'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0';

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
            message: 'Jumlah notifikasi belum dibaca berhasil diambil',
            data: {
                unread_count: results[0].count
            }
        });
    });
};

module.exports = {
    checkRentalTimeNotifications,
    checkLateRentalNotifications,
    getUserNotifications,
    markNotificationRead,
    getUnreadCount
}; 