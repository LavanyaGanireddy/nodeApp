const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const dbConfig = require("../config/db");

const connectDB = async () => {
    try {
        // mongodb connection
        const con = mongoose.connect(dbConfig.connectionUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = mongoose.connection;

        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        db.once('connected', () => {
            console.log('Mongodb connected');
        })
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = connectDB;