// routes/filterProductsRouter.js

const express = require('express');
const router = express.Router();
const productsController = require('../controllers/filterProductsController');
const { emailmiddleware } = require('../middleware/email');

// Apply emailmiddleware before the productsController.filterProducts
router.get('/', emailmiddleware, productsController.filterProducts);

module.exports = router;
