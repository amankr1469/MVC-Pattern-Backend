const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

const errorMiddleware = require('./middleware/error');

app.use(express.json());
app.use(cookieParser());

// Route Imports
const product = require("./routes/productRoute");


app.use("/api/v1", product);


//Middleware for Error
app.use(errorMiddleware);

module.exports = app