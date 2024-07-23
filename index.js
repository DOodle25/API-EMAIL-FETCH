const express = require('express');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// require('dotenv').config();

const apiRouter = require('./api');

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());

// Mount API routes from api.js
app.use('/api', apiRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
