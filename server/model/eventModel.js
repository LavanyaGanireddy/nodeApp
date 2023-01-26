const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const schema = new mongoose.Schema({
    id: {
        type: Number
    },
    email: {
        type: String,
        reuired: true,
        unique: true
    },
    role: {
        type: String
    },
    isDeleted: {
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
}, { collection: 'eventList' });

schema.set('timestamps', true);

schema.plugin(autoIncrement.plugin, { model: 'eventList', field: 'id', startAt: 1, incrementBy: 1 });

module.exports = mongoose.model('eventList', schema);
