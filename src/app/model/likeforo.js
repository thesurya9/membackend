'use strict';

const mongoose = require('mongoose');
const likesForoSchema = new mongoose.Schema({
    foro: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Foro'
    },
    liked_by: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

likesForoSchema.set('toJSON', {
    getters: true,
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('LikeForo', likesForoSchema);