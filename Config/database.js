const mysql = require('mysql');

// Konfigurasi koneksi database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Shacia1858',
  database: 'project_sewasepeda'
});

// Membuat koneksi ke database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Successfully connected to database');
});

module.exports = connection;
