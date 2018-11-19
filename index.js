const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const flash = require('connect-flash');
const session = require('express-session');

// set up express app
const app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Passport
let secret;
if (process.env.NODE_ENV === 'production') {
  secret = process.env.EXPRESS_SECRET
} else {
  secret = 'some stupid secret'
}

if (!secret) {
  throw new Error('Environment variable EXPRESS_SECRET should be set! Cannot start application!')
}

app.use(session({
   secret: secret,
   resave: false,
   saveUninitialized: true
  }));

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use(bodyParser.json())

// initialize routes
app.use('/', require('./routes/api'))

// listen for requests
app.set('port', process.env.PORT || 3001)

app.listen(app.get('port'), () => {
  console.log(`PORT: ${app.get('port')}`)
})