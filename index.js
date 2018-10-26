const express = require('express')
const bodyParser = require('body-parser')

// set up express app
const app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json())

// initialize routes
app.use('/', require('./routes/api'))

// error handling middleware
// app.use(function (err, req, res, next) {
//   res.status(422).send({error: err.message})
// })

// listen for requests
app.set('port', process.env.PORT || 3001)

app.listen(app.get('port'), () => {
  console.log(`PORT: ${app.get('port')}`)
})