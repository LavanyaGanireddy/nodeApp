var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
    name: String,
    desc: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
}, { collection: 'imageList' });

module.exports = new mongoose.model('imageList', imageSchema);