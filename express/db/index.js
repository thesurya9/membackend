'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const options = {
    keepAlive: 1000,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true ,
    useFindAndModify: false
};
// mongoose.connect(process.env.DB_URL, options, (err, db) => {
    mongoose.connect('mongodb+srv://social:social@cluster0.qtgbt.mongodb.net/social?retryWrites=true&w=majority', options, (err, db) => {
    if (err) console.log('Mongoose connection error', err.message);
});
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected');
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});
mongoose.connection.on('error', console.error.bind(console, 'MongoDb connection error'));

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});
