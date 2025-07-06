const express = require('express');
const app = express();
const port = 3000;
const testRoutes = require('./routes/testRoutes');
const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const simulationRoutes = require('./routes/simulationRoutes');

// Middleware untuk parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', testRoutes);
app.use('/api', loginRoutes);
app.use('/api', registerRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', rentalRoutes);
app.use('/api', paymentRoutes);
app.use('/api', simulationRoutes);

// Route dasar
app.get('/', (req, res) => {
  res.send('Selamat datang di aplikasi Express.js saya!');
});

// Contoh route dengan parameter
app.get('/user/:id', (req, res) => {
  res.send(`ID User: ${req.params.id}`);
});

// Contoh route POST
app.post('/data', (req, res) => {
  const data = req.body;
  res.json({
    message: 'Data diterima',
    data: data
  });
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
  console.log(`Direct Links:`);
  console.log(`Homepage: http://localhost:${port}`);
  console.log(`Test Database Connection: http://localhost:${port}/api/test-connection`);
  console.log(`Login (POST): http://localhost:${port}/api/login`);
  console.log(`Register (POST): http://localhost:${port}/api/register`);
  console.log(`User Example: http://localhost:${port}/user/1`);
  console.log(`Test POST data: http://localhost:${port}/data`);
  console.log(`----------------------------------------`);
}); 