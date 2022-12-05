'use strict';

const mongoose = require('mongoose');
const EventGoing = new mongoose.Schema({

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

EventGoing.set('toJSON', {
    getters: true,
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('EventGoing', EventGoing);