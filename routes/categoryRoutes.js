const express = require('express');
const router = express.Router();
const { 
    getAllCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory 
} = require('../controllers/categoryController');

router.get('/categories', getAllCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

module.exports = router; 