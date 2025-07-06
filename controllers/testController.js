const db = require('../Config/database.js');

const testConnection = (req, res) => {
    db.query('SELECT 1 + 1 AS solution', (err, results) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Database connection failed',
                error: err
            });
        }
        
        return res.status(200).json({
            status: true,
            message: 'Database connection successful',
            data: results
        });
    });
};

module.exports = {
    testConnection
}; 