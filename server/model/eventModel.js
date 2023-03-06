const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const eventSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    organisedBy: {
        type: String,
        required: true,
    },
    startDate: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isUpdated: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: String,
        default: ''
    },
    deletedBy: {
        type: String,
        default: ''
    },
    updatedBy: {
        type: String,
        default: ''
    },
    updatedAt: {
        type: String,
        default: ''
    },
    createdAt: {
        type: String,
        default: ''
    },
    deletedAt: {
        type: String,
        default: ''
    },
}, { collection: 'eventList' });

eventSchema.set('timestamps', true);

eventSchema.plugin(autoIncrement.plugin, { model: 'eventList', field: 'id', startAt: 1, incrementBy: 1 });

module.exports = mongoose.model('eventList', eventSchema);
