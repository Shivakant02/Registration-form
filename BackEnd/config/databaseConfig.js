require('dotenv').config()
const mongoose = require('mongoose')

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/My-Database"

const databaseConnect = () => {
    mongoose
        .connect(MONGODB_URL)
        .then((conn) => {
            console.log(`Connected to ${conn.connection.host}`)
            
        })
        .catch((e) => {
        console.log(e.message);
    })
}

module.exports = databaseConnect;