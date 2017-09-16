"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// main user Schema
let userSchema = mongoose.Schema({
  local : {
    email: String,
    password: String
  }
});

//----------------- User methods

// generate hash
userSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// validate password
userSchema.methods.validPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};

// expose user model
module.exports = mongoose.model('User', userSchema);
