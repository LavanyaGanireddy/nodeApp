const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    image: {
        type: String
    }
});

module.exports = new mongoose.model('Image', imageSchema);