const connectToMongo = require('./db');
const express = require('express');
connectToMongo();
require("dotenv").config({path:'./config.env'});
const app = express() 
const port = process.env.PORT || 4000;

app.use(express.json())
app.use('/api/auth',require('./routes/auth')); 
app.use('/api/trip',require('./routes/trip')); 

app.listen(port, () => {
    console.log(`Blinsoft backend listening at http://localhost:${port}`)
})