const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {

    err.message = err.message || "Internal Server Error";
    err.statusCode = err.status || 500;

    //Wrong Mongodb ID error
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid:${err.path}`;
        err = new ErrorHandler(message, 404);
    }

    //Wrong JWT error
    if(err.name === "JsonwebTokenError"){
        const message = `Json web token invalid, try again`;
        err = new ErrorHandler(message,400);
    }
    
    //JWT expire error 
    if(err.name === "TokenExpiredError"){
        const message = `Json web token expired, try again`;
        err = new ErrorHandler(message,400);
    }
    res.status(err.statusCode).json({
        success:false,
        error:err.message
    })

}