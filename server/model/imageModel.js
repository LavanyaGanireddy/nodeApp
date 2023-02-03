const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const imageSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    eventName: {
        type: String,
        reuired: true
    },
    imageName: {
        type: String
    },
    image: {
        data: String,
        contentType: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    uploadedBy: {
        type: String,
        default: ''
    },
    updatedBy: {
        type: String,
        default: ''
    },
    deletedBy: {
        type: String,
        default: ''
    },
    createdAt: {
        type: String,
        default: ''
    },
    updatedAt: {
        type: String,
        default: ''
    },
    deletedAt: {
        type: String,
        default: ''
    }
}, { collection: 'imageList' });

imageSchema.set('timestamps', true);

imageSchema.plugin(autoIncrement.plugin, { model: 'imageList', field: 'id', startAt: 1, incrementBy: 1 });

module.exports = new mongoose.model('imageList', imageSchema);