'use strict';

const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({

    title: {
        type: String,
        trim: true,
        require: true
    },
    description: {
        type: String,
        trim: true,
        require: true
    },
    image: {
        type: String,
        trim: true,
        //require: true
    },
    postedby: {
        type: String,
        trim: true,
        require: true
    },
    category: {
        type: String,
        trim: true,
        require: true
    },
    startdate: {
        type: Date,
        trim: true,
        require: true
    },
    enddate: {
        type: Date,
        trim: true,
        require: true
    },
    website:{
        type:String,
        trim: true,
    },
    fee:{
        type:String,
        trim: true,   
    },
    starttime:{
        type:String,
        trim: true,   
    },
    endtime:{
        type:String,
        trim: true,   
    },
    address:{
        type:String,
        trim: true,   
    }
}, {
    timestamps: true
});
eventSchema.set('toJSON', {
    getters: true,
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Event', eventSchema);
