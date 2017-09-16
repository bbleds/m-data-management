"use strict";

// load in 3rd-party dependencies
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

// load in custom dependencies
const dbConf = require('./config/database.js');

// configure app and middleware
const app = express();
let port = process.env.PORT || 3001;
mongoose.connect(dbConf.url, {useMongoClient: true});
// require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));

// passport middleware
app.use(session({ secret: 'jshero' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// handle routing
require('./app/routes.js')(app, passport);

// spin up app
app.listen(port);
console.log(`App running on port ${port}`);
