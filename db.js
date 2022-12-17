const mongoose = require('mongoose');
require("dotenv").config({path:'./config.env'});

const mongoURI= process.env.DB_URL ; 

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected to Mongo Successfully");
    })
}
module.exports = connectToMongo; 