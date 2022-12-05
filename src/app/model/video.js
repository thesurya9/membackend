'use strict';

const mongoose = require('mongoose');
const videoSchema = new mongoose.Schema({

    title: {
        type: String,
        trim: true,
        // require: true
    },
    description: {
        type: String,
        trim: true,
        // require: true
    },
    video: {
        type: String,
        trim: true,
        //require: true
    },
    youtube_url: {
        type: String,
        trim: true,
        //require: true
    },
    category:{
        type:String,
        trim:true,
        require:true
    }

    // poster: {
    //     type: String,
    //     trim: true,
    //     //require: true
    // },
   
}, {
    timestamps: true
});
videoSchema.set('toJSON', {
    getters: true,
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Video', videoSchema);