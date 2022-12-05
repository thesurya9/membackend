'use strict';

const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({

    title: {
        type: String,
        trim:true,
        require:true
    },
    description:{
        type: String,
        trim:true,
        require:true
    },
    image:{
        type:String,
        trim:true,
        require:true
    },
    postedby:{
        type:String,
        trim:true,
        require:true
    },
    // posteddate:{
    //     type:Date,
    //     default:new Date(),
    //     trim:true

    // },
    category:{
        type:String,
        trim:true,
        require:true
    }

}, {
    timestamps: true
});
blogSchema.set('toJSON', {
    getters: true,
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Blog', blogSchema);
