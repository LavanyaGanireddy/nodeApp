const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        reuired: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
}, { collection: 'userList' });

module.exports = mongoose.model('userList', schema);
