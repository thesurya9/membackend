'use strict';

const mongoose = require('mongoose');
const EventIntrested = new mongoose.Schema({

    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },

    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]

}, {
    timestamps: true
});

EventIntrested.set('toJSON', {
    getters: true,
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('EventInterested', EventIntrested);