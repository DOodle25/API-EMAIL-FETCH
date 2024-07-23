const express = require('express');
const router = express.Router();
const categoriesRouter = require('./routes/CategoriesRoute');
const companiesRouter = require('./routes/CompaniesRoute');
const productsRouter = require('./routes/FilterProductsRoute');

router.use('/categories', categoriesRouter);
router.use('/companies', companiesRouter);
router.use('/filterProducts', productsRouter);

module.exports = router;
