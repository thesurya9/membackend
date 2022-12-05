const app = require('express')();
require("dotenv").config();
const passport = require('passport');
const bodyParser = require('body-parser');
const noc = require('no-console');
const cors = require('cors');

// Bootstrap schemas, models
require("./bootstrap");
// App configuration
noc(app);
app.use(bodyParser.json({limit:'10mb',extended: true}));
app.use(passport.initialize());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Origin,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})


var corsOptions = {
    origin: "*"
};
app.use(cors(corsOptions));

//Database connection
require('./db');
//Passport configuration
require('./passport')(passport);
//Routes configuration
require("./../src/routes")(app);


module.exports = app;