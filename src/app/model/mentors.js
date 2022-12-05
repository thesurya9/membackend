'use strict';

const mongoose = require('mongoose');
const mentorsSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        require: true
    },
    title: {
        type: String,
        trim: true,
        require: true
    },
    description: {
        type: Array,
        trim: true,
        require: true
    },
    biodescription: {
        type: Array,
        trim: true,
        require: true
    },
    titledescriptipon: {
        type: Boolean,
        default:true
    },
    biodescript: {
        type: Boolean,
        default:true
    },
    profileImg:{
        type: String,
        trim: true,
        require: true
    }

}, {
    timestamps: true
});

mentorsSchema.set('toJSON', {
    getters: true,
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Mentors', mentorsSchema);