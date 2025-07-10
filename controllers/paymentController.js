const db = require('../Config/database.js');
const midtransClient = require('midtrans-client');

// Create Snap API instance
const snap = new midtransClient.Snap({
    // Set to true if you want Production Environment (accept real transaction)
    isProduction: false,
    serverKey: 'SB-Mid-server-yOklCwe5I_63lC5lDN3k8Kyw',
    clientKey: 'SB-Mid-client-R_h8dtZUuy1pK8fn'
});

// Helper function to generate payment URL for simulation
const generateSimulationUrl = (rental_id, payment_method, totalAmount) => {
    // For simulation purposes, we'll create a simple URL structure
    // In a real app, you would use Midtrans redirect URLs
    return `http://localhost:3000/payment-simulation.html?rental_id=${rental_id}&method=${payment_method}&amount=${totalAmount}`;
};

// Create payment for a rental
const createPayment = (req, res) => {
    const { rental_id } = req.params;
    const { payment_method } = req.body; // Optional: Allow client to specify payment method

    // Get rental data
    const query = `
        SELECT 
            r.id,
            r.customer_name,
            p.name as product_name,
            r.rental_hours,
            r.total_amount,
            r.penalty_amount,
            r.payment_status,
            r.payment_method,
            r.penalty_payment_status
        FROM rentals r
        JOIN products p ON r.product_id = p.id
        WHERE r.id = ?
    `;

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

        // Cek status pembayaran rental
        if (rental.payment_status === 'paid') {
            return res.status(400).json({
                status: false,
                message: 'Pembayaran rental sudah dilakukan'
            });
        }

        // Untuk pembayaran rental, tidak termasuk denda
        const totalAmount = rental.total_amount;



        // Determine payment method to use
        const selectedPaymentMethod = payment_method || rental.payment_method || 'credit_card';
        
        // Set payment method specific configuration
        let paymentConfig = {};
        
        if (selectedPaymentMethod === 'credit_card') {
            paymentConfig = {
                credit_card: {
                    secure: true
                }
            };
        } else if (selectedPaymentMethod === 'bank_transfer') {
            paymentConfig = {
                bank_transfer: {
                    bank: ['bca', 'bni', 'bri', 'mandiri']
                }
            };
        } else if (selectedPaymentMethod === 'gopay') {
            paymentConfig = {}; // No special config needed for gopay
        } else if (selectedPaymentMethod === 'qris') {
            paymentConfig = {}; // No special config needed for qris
        }
        
        // Create transaction parameter
        const parameter = {
            transaction_details: {
                order_id: `RENTAL-${rental.id}-${Date.now()}`,
                gross_amount: totalAmount
            },
            customer_details: {
                first_name: rental.customer_name,
                email: `${rental.customer_name.replace(/\s+/g, '').toLowerCase()}@example.com`,
                phone: '08111222333'
            },
            item_details: [
                {
                    id: `PRODUCT-${rental.id}`,
                    price: rental.total_amount,
                    quantity: 1,
                    name: `Rental ${rental.product_name} (${rental.rental_hours} jam)`
                }
            ],
            ...paymentConfig,
            callbacks: {
                finish: 'http://localhost:3000',
                error: 'http://localhost:3000',
                pending: 'http://localhost:3000'
            }
        };

        // Add penalty to item details if exists
        if (rental.penalty_amount && rental.penalty_amount > 0) {
            parameter.item_details.push({
                id: `PENALTY-${rental.id}`,
                price: rental.penalty_amount,
                quantity: 1,
                name: 'Denda keterlambatan'
            });
        }

        // Create transaction token
        snap.createTransaction(parameter)
            .then((transaction) => {
                // Save transaction token and payment method to database
                const updateQuery = 'UPDATE rentals SET payment_token = ?, payment_url = ?, payment_method = ? WHERE id = ?';
                db.query(updateQuery, [transaction.token, transaction.redirect_url, selectedPaymentMethod, rental_id], (err) => {
                    if (err) {
                        return res.status(500).json({
                            status: false,
                            message: 'Error updating payment information',
                            error: err
                        });
                    }

                    return res.status(200).json({
                        status: true,
                        message: 'Token pembayaran berhasil dibuat',
                        data: {
                            rental_id: rental.id,
                            payment_method: selectedPaymentMethod,
                            token: transaction.token,
                            redirect_url: transaction.redirect_url,
                            total_amount: totalAmount
                        }
                    });
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    status: false,
                    message: 'Error creating payment token',
                    error: error.message
                });
            });
    });
};

// Handle notification from Midtrans
const handleNotification = (req, res) => {
    console.log('Received notification payload:', req.body);
    const notificationJson = req.body;

    // Create Core API / Snap instance
    const apiClient = new midtransClient.Snap({
        isProduction: false,
        serverKey: 'SB-Mid-server-yOklCwe5I_63lC5lDN3k8Kyw',
        clientKey: 'SB-Mid-client-R_h8dtZUuy1pK8fn'
    });

    console.log('Processing notification with Midtrans client...');

    apiClient.transaction.notification(notificationJson)
        .then((statusResponse) => {
            const orderId = statusResponse.order_id;
            const transactionStatus = statusResponse.transaction_status;
            const fraudStatus = statusResponse.fraud_status;

            console.log('Full order ID received:', orderId);

            // Extract rental ID and payment type from order ID
            // Format: RENTAL-{id}-{timestamp} atau PENALTY-{id}-{timestamp}
            const parts = orderId.split('-');
            console.log('Order ID parts:', parts);

            const paymentType = parts[0]; // RENTAL atau PENALTY
            const rentalId = parts[1]; // Get the ID part
            
            // Clean up rental ID (remove timestamp if present)
            const cleanRentalId = rentalId;
            
            console.log('Extracted payment info:', {
                paymentType,
                rentalId,
                cleanRentalId,
                transactionStatus,
                fraudStatus
            });

            console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

            // Set payment status based on transaction status
            let paymentStatus;

            if (transactionStatus == 'capture' || transactionStatus == 'settlement') {
                // Langsung set paid untuk capture dan settlement
                paymentStatus = 'paid';
            } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
                paymentStatus = 'failed';
            } else {
                paymentStatus = 'pending';
            }

            // Update payment status in database based on payment type
            let updateQuery;
            let queryParams;
            let updateFields = {};

            if (paymentType === 'RENTAL') {
                updateQuery = 'UPDATE rentals SET payment_status = ? WHERE id = ?';
                queryParams = [paymentStatus, cleanRentalId];
                console.log('Processing RENTAL payment update');
            } else if (paymentType === 'PENALTY') {
                updateQuery = 'UPDATE rentals SET penalty_payment_status = ? WHERE id = ?';
                queryParams = [paymentStatus, cleanRentalId];
                console.log('Processing PENALTY payment update');
            } else {
                console.log('WARNING: Unknown payment type:', paymentType);
            }

            console.log('Updating payment:', {
                paymentType,
                cleanRentalId,
                paymentStatus,
                originalOrderId: orderId
            });

            console.log('Executing query:', {
                query: updateQuery,
                params: queryParams
            });

            db.query(updateQuery, queryParams, (err, result) => {
                if (err) {
                    console.error('Error updating payment status:', err);
                    return res.status(500).end();
                }
                console.log('Database update result:', result);
                return res.status(200).json({
                    status: true,
                    message: 'Payment notification processed successfully',
                    data: {
                        order_id: orderId,
                        payment_type: paymentType,
                        rental_id: cleanRentalId,
                        payment_status: paymentStatus
                    }
                });
            });
        })
        .catch((error) => {
            console.error('Error processing notification:', error);
            return res.status(500).end();
        });
};

// Get payment status
const getPaymentStatus = (req, res) => {
    const { rental_id } = req.params;

    const query = `
        SELECT 
            id,
            payment_status,
            payment_token,
            payment_url,
            penalty_amount,
            penalty_payment_status
        FROM rentals
        WHERE id = ?
    `;

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

        return res.status(200).json({
            status: true,
            message: 'Status pembayaran berhasil diambil',
            data: {
                rental_id: results[0].id,
                payment_status: results[0].payment_status,
                payment_token: results[0].payment_token,
                payment_url: results[0].payment_url,
                penalty_amount: results[0].penalty_amount,
                penalty_payment_status: results[0].penalty_payment_status
            }
        });
    });
};

const updatePaymentStatus = (req, res) => {
    const { rental_id } = req.params;
    const isPenaltyUpdate = req.path.includes('/penalty/');
    
    // Menggunakan field yang sesuai dari body request
    const status = isPenaltyUpdate ? req.body.penalty_payment_status : req.body.payment_status;
    
    if (!status) {
        return res.status(400).json({
            status: false,
            message: `${isPenaltyUpdate ? 'penalty_payment_status' : 'payment_status'} is required`
        });
    }

    let updateQuery;
    let queryParams;

    if (isPenaltyUpdate) {
        // Update penalty payment status only
        updateQuery = 'UPDATE rentals SET penalty_payment_status = ? WHERE id = ?';
        queryParams = [status, rental_id];
    } else {
        // Update main rental payment status
        updateQuery = 'UPDATE rentals SET payment_status = ? WHERE id = ?';
        queryParams = [status, rental_id];
    }

    db.query(updateQuery, queryParams, (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Error updating payment status',
                error: err
            });
        }

        return res.status(200).json({
            status: true,
            message: `${isPenaltyUpdate ? 'Penalty payment' : 'Payment'} status updated successfully`,
            data: {
                rental_id: rental_id,
                [isPenaltyUpdate ? 'penalty_payment_status' : 'payment_status']: status
            }
        });
    });
};

// Create payment for penalty only
const createPenaltyPayment = (req, res) => {
    const { rental_id } = req.params;
    const { payment_method } = req.body;

    // Get rental data
    const query = `
        SELECT 
            r.id,
            r.customer_name,
            p.name as product_name,
            r.rental_hours,
            r.penalty_amount,
            r.penalty_payment_status,
            r.payment_method
        FROM rentals r
        JOIN products p ON r.product_id = p.id
        WHERE r.id = ?
    `;

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

        // Pada endpoint createPenaltyPayment, sudah dicek jika penalty_amount == 0 maka return error, frontend bisa handle label 'Tidak Ada Denda'
        if (!rental.penalty_amount || rental.penalty_amount === 0) {
            return res.status(400).json({
                status: false,
                message: 'Tidak ada denda yang perlu dibayar'
            });
        }

        // Cek status pembayaran denda
        if (rental.penalty_payment_status === 'paid') {
            return res.status(400).json({
                status: false,
                message: 'Denda sudah dibayar'
            });
        }

        // Determine payment method to use
        const selectedPaymentMethod = payment_method || rental.payment_method || 'credit_card';
        
        // Set payment method specific configuration
        let paymentConfig = {};
        
        if (selectedPaymentMethod === 'credit_card') {
            paymentConfig = {
                credit_card: {
                    secure: true
                }
            };
        } else if (selectedPaymentMethod === 'bank_transfer') {
            paymentConfig = {
                bank_transfer: {
                    bank: ['bca', 'bni', 'bri', 'mandiri']
                }
            };
        } else if (selectedPaymentMethod === 'gopay') {
            paymentConfig = {};
        } else if (selectedPaymentMethod === 'qris') {
            paymentConfig = {};
        }
        
        // Create transaction parameter for penalty payment
        const parameter = {
            transaction_details: {
                order_id: `PENALTY-${rental.id}-${Date.now()}`,
                gross_amount: rental.penalty_amount
            },
            customer_details: {
                first_name: rental.customer_name,
                email: `${rental.customer_name.replace(/\s+/g, '').toLowerCase()}@example.com`,
                phone: '08111222333'
            },
            item_details: [
                {
                    id: `PENALTY-${rental.id}`,
                    price: rental.penalty_amount,
                    quantity: 1,
                    name: 'Denda keterlambatan'
                }
            ],
            ...paymentConfig,
            callbacks: {
                finish: 'http://localhost:3000',
                error: 'http://localhost:3000',
                pending: 'http://localhost:3000'
            }
        };

        // Create transaction token
        snap.createTransaction(parameter)
            .then((transaction) => {
                // Save transaction token and payment method to database
                const updateQuery = 'UPDATE rentals SET penalty_payment_token = ?, penalty_payment_url = ?, payment_method = ? WHERE id = ?';
                db.query(updateQuery, [transaction.token, transaction.redirect_url, selectedPaymentMethod, rental_id], (err) => {
                    if (err) {
                        return res.status(500).json({
                            status: false,
                            message: 'Error updating payment information',
                            error: err
                        });
                    }

                    return res.status(200).json({
                        status: true,
                        message: 'Token pembayaran denda berhasil dibuat',
                        data: {
                            rental_id: rental.id,
                            payment_method: selectedPaymentMethod,
                            token: transaction.token,
                            redirect_url: transaction.redirect_url,
                            penalty_amount: rental.penalty_amount
                        }
                    });
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    status: false,
                    message: 'Error creating payment token',
                    error: error.message
                });
            });
    });
};

// Get penalty payment status
const getPenaltyPaymentStatus = (req, res) => {
    const { rental_id } = req.params;

    const query = `
        SELECT 
            id,
            penalty_amount,
            penalty_payment_status,
            penalty_payment_token,
            penalty_payment_url
        FROM rentals
        WHERE id = ?
    `;

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

        return res.status(200).json({
            status: true,
            message: 'Status pembayaran denda berhasil diambil',
            data: {
                rental_id: results[0].id,
                penalty_amount: results[0].penalty_amount,
                penalty_payment_status: results[0].penalty_payment_status,
                penalty_payment_token: results[0].penalty_payment_token,
                penalty_payment_url: results[0].penalty_payment_url
            }
        });
    });
};

module.exports = {
    createPayment,
    createPenaltyPayment,
    handleNotification,
    getPaymentStatus,
    updatePaymentStatus,
    getPenaltyPaymentStatus
};
