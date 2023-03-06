const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const donationSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    email: {
        type: String,
        required: true
    },
    donar: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    donationType: {
        type: String,
        required: true,
        enum: ["Online", "Offline"],
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isUpdated: {
        type: Boolean,
        default: false
    },
    updatedBy: {
        type: String,
        default: ''
    },
    createdBy: {
        type: String,
        default: ''
    },
    deletedBy: {
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
}, { collection: 'donationList' });

donationSchema.set('timestamps', true)

donationSchema.plugin(autoIncrement.plugin, { model: 'donationList', field: 'id', startAt: 1, incrementBy: 1 });

module.exports = mongoose.model('donationList', donationSchema);