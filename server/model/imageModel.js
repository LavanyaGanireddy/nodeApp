const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    name: String,
    image: {
        data: String,
        contentType: String
    }
});

module.exports = new mongoose.model('Image', imageSchema);