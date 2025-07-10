const express = require('express');
const path = require('path');
const router = express.Router();
const { 
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus,
    getProductsByStatus
} = require('../controllers/productController');

router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.put('/products/:id/status', updateProductStatus);
router.get('/products/status/:status', getProductsByStatus);

// Serve product images
router.use('/uploads/products', express.static(path.join(__dirname, '../uploads/products')));

module.exports = router; 