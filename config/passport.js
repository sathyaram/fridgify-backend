var LocalStrategy = require("passport-local").Strategy;
var User            = require('../db/models/User');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, callback) {
    User.findById(id, function(err, user) {
      callback(err, user);
    });
  });

  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      function(email, password, callback) {
        console.log(email + password);
        User.findOne({ email: email }, function(err, user) {
          if (err) return callback(err);

          // If there already is a user with this email
          if (user) {
            console.log('email already exists')
            return callback(
              null,
              false,
              { message: 'This email is already used.' }
            );
          } else {
            // There is no email registered with this email

            // Create a new user
            var newUser = new User();
            newUser.email = email;
            newUser.password = newUser.encrypt(password);

            newUser.save(function(err) {
              if (err) throw err;
              return callback(null, newUser);
            });
          }
        });
      }
    )
  );

  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
  }, function(email, password, callback) {

    // Search for a user with this email
    User.findOne({ 'email' :  email }, function(err, user) {
      if (err) {
        return callback(err);
      }

      // If no user is found
      if (!user) {
        return callback(null, false, { message: 'No user found.' });
      }
      // Wrong password
      if (!user.validPassword(password)) {
        return callback(null, false, { message: "Password not valid." });
      }

      return callback(null, user);
    });
  }));
};
