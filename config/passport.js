"use strict";

// load all the things we need
const LocalStrategy = require('passport-local').Strategy;

// load up the user model
const User = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // used to deserialize the user for use in app
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    // ------------- passport strategies

    // sign-up handling
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    }, (req, email, password, done) => {

      process.nextTick(() =>{
        // check if user trying to login already exists
        User.findOne({ 'local.email' :  email }, (err, user) => {

          if (err) { return done(err) }; // if there are any errors, return the error

          // check if user already exists
          if (user) {
            return done(null, false, req.flash('signupMessage', 'This email may already be in our system or an error has occurred. Please try again'));
          } else {
            // create new user
            let newUser  = new User();

            // set the user's local credentials
            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);

            // save the user
            newUser.save(function(err) {
              if (err) { throw err };
              return done(null, newUser);
            });
          }
        });
    });
  }));

  // login handling
  passport.use('local-login', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
  }, (req, email, password, done) => {

      // find user with input credentials
      User.findOne({ 'local.email' :  email }, (err, user) => {

        if (err) { return done(err) }; // if there are any errors, return the error

        let loginErrMsg = 'Login failed. This user may not exist, credentials may be incorrect, or an error may have occurred. Please try again';

        // return error message if user was not found
        if (!user) { return done(null, false, req.flash('loginMessage', loginErrMsg)); }

        // validate password
        if(!user.validPassword(password, user.local.password)){  return done(null, false , req.flash('loginMessage', loginErrMsg)); }

        // auth success, log user in
        return done(null, user);
      });
}));
};
