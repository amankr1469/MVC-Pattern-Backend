const app = require('./app');

const {config} = require('dotenv');

const connectDatabase = require("./config/database")

//Handling Uncaught Exceptions
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down server due to Uncaught Exception`);

    process.exit(1);
})

//Connecting to .env file (path to .env file)
config({path:"config/config.env"}); 

//Connecting to Database
connectDatabase()

// Creating server and listening (PORT, callback fun())
const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port http://localhost:${process.env.PORT}`);
})