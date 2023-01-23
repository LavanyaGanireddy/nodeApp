const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 10;

autoIncrement.initialize(mongoose.connection);

const schema = new mongoose.Schema({
    id: {
        type: Number
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        reuired: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'User'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isUpdated: {
        type: Boolean,
        default: false
    }
}, { collection: 'userList' });

schema.plugin(autoIncrement.plugin, { model: 'userList', field: 'id', startAt: 1, incrementBy: 1 });

schema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err);
    }
})

schema.methods.matchPassword = async function matchPassword(data) {
    const validate = bcrypt.compare(data, this.password);
    return validate;
};

module.exports = mongoose.model('userList', schema);