var express = require('express')
var app = express()
var path = require('path')
var morgan = require('morgan')
var debug = require('debug')('app')
// var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var config = require('config')

var session = require('express-session')
var sessionStore = require('./libs/sessionStore')(session)

app.use(morgan('dev'))
app.use(bodyParser.json()) // Позволяет передавать в body запроса json
app.use(bodyParser.urlencoded({ extended: false })) // позволяет передавать в body запроса key=value

// views
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(express.static(path.join(__dirname, 'public')))

require('./libs/connect')(app)

// routes
app.use(session({
  secret: config.get('session.secret'),
  key: config.get('session.key'),
  cookie: config.get('session.cookie'),
  store: sessionStore,
  resave: false,
  saveUninitialized: true
}))

var index = require('./routes/index')
var api = require('./routes/api')

app.use('/', index)
app.use('/api', api)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    debug('shit ' + err.message)
    // res.status(err.status || 500).send()
  })
}

// // production error handler
// // no stacktraces leaked to user
app.use(function (err, req, res, next) {
  debug('something wrong ' + err.message)
  // res.status(err.status || 500).send()
})

// Пашины хендлеры. Нужны ли?
// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function (err, req, res, next) {
//     res.status(err.status || 500)
//     debug(err)
//     res.render('error', {
//       message: err.message,
//       error: err
//     })
//   })
// }

// production error handler
// no stacktraces leaked to user
// app.use(function (err, req, res, next) {
//   res.status(err.status || 500)
//   debug(err)
//   res.render('error', {
//     message: err.message,
//     error: {}
//   })
// })

module.exports = app
