const db = require('../Config/database.js');

// Simulate payment completion
const simulatePayment = (req, res) => {
    const { rental_id, payment_method } = req.body;

    if (!rental_id) {
        return res.status(400).json({
            status: false,
            message: 'ID rental harus disediakan'
        });
    }

    // Get rental data
    const query = 'SELECT id, payment_status FROM rentals WHERE id = ?';
    db.query(query, [rental_id], (err, results) => {
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
                message: 'Data rental tidak ditemukan'
            });
        }

        const rental = results[0];

        if (rental.payment_status === 'paid') {
            return res.status(400).json({
                status: false,
                message: 'Pembayaran untuk rental ini sudah dilakukan'
            });
        }

        // Update payment status to paid
        const updateQuery = 'UPDATE rentals SET payment_status = ?, payment_method = ? WHERE id = ?';
        db.query(updateQuery, ['paid', payment_method || 'simulation', rental_id], (err) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Error updating payment status',
                    error: err
                });
            }

            return res.status(200).json({
                status: true,
                message: 'Pembayaran berhasil disimulasikan',
                data: {
                    rental_id: parseInt(rental_id),
                    payment_status: 'paid',
                    payment_method: payment_method || 'simulation',
                    transaction_time: new Date().toISOString()
                }
            });
        });
    });
};

// Get available payment methods
const getPaymentMethods = (req, res) => {
    const paymentMethods = [
        { code: 'credit_card', name: 'Kartu Kredit/Debit' },
        { code: 'bank_transfer', name: 'Transfer Bank' },
        { code: 'gopay', name: 'GoPay' },
        { code: 'qris', name: 'QRIS' },
        { code: 'simulation', name: 'Simulasi Pembayaran (Testing)' }
    ];

    return res.status(200).json({
        status: true,
        message: 'Daftar metode pembayaran',
        data: paymentMethods
    });
};

module.exports = {
    simulatePayment,
    getPaymentMethods
};
