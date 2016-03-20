var app = require('express')();
// var path = require('path');
var morgan = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

app.use(morgan('dev'));
app.use(bodyParser.json()); // Позволяет передавать в body запроса json
app.use(bodyParser.urlencoded({ extended: false })); // позволяет передавать в body запроса key=value
// app.use(cookieParser()); // TODO: Зачем нужна?

// routes
app.use('/api', routes); // API контактов

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
