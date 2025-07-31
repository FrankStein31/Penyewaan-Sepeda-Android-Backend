const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const testRoutes = require('./routes/testRoutes');
const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const simulationRoutes = require('./routes/simulationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { 
    checkRentalTimeNotifications, 
    checkLateRentalNotifications 
} = require('./controllers/notificationController');

// Middleware untuk CORS
app.use(cors());

// Middleware untuk parse JSON
app.use(express.json());

// Buat folder uploads jika belum ada
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');
const ktpDir = path.join(uploadDir, 'ktp');
const productsDir = path.join(uploadDir, 'products');
const damageProofsDir = path.join(uploadDir, 'damage_proofs');
const profileDir = path.join(uploadDir, 'profile');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(ktpDir)) {
    fs.mkdirSync(ktpDir);
}
if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir);
}
if (!fs.existsSync(damageProofsDir)) {
    fs.mkdirSync(damageProofsDir);
}
if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir);
}

// Middleware untuk serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', testRoutes);
app.use('/api', loginRoutes);
app.use('/api', registerRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', rentalRoutes);
app.use('/api', paymentRoutes);
app.use('/api', simulationRoutes);
app.use('/api', notificationRoutes);

// Scheduler untuk notifikasi
setInterval(checkRentalTimeNotifications, 60000); // Check setiap 1 menit
setInterval(checkLateRentalNotifications, 60000); // Check setiap 1 menit

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
}); 