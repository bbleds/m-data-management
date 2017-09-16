"use strict";

/**
 * User schema and method for interfacing with mongo database
 */

// Load 3rd-party deps
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Set user schema
let userSchema = mongoose.Schema({
  local : {
    email: String,
    password: String
  }
});

/**
 * Generates a password hash for a user
 * @param {string} password This is the password that a user submits
 */
userSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/**
 * Validates a password based on user-entered password and hashed password in db
 * @param {string} password This is the password that a user submits
 * @param {string} hash This is the password hash stored in the database
 */
userSchema.methods.validPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};

// Expose user model
module.exports = mongoose.model('User', userSchema);
