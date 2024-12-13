const express = require('express');
const { createProduct, getProduct } = require('../controllers/productController');
const router = express.Router();

router.post('/create', createProduct);
router.get('/get', getProduct);

module.exports = router;
