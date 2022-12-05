'use strict';

const mongoose = require('mongoose');
const mentorshipSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        require: true
    },
    email: {
        type: String,
        trim: true,
        require: true
    },
    mobile: {
        type: String,
        trim: true,
        require: true
    },
    question: {
        type: String,
        trim: true,
        require: true
    },
    mentorname: {
        type: String,
        trim: true,
        require: true
    }

}, {
    timestamps: true
});

mentorshipSchema.set('toJSON', {
    getters: true,
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Mentorship', mentorshipSchema);
