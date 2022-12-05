'use strict';

const mongoose = require('mongoose');
const forocommentsSchema = new mongoose.Schema({
    foro: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Foro'
    },
    comment_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comment: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

forocommentsSchema.set('toJSON', {
    getters: true,
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('CommentForo', forocommentsSchema);