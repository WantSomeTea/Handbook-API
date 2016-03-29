var express = require('express');
var app = express();
var path = require('path');
var morgan = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var api = require('./routes/index');

app.use(morgan('dev'));
app.use(bodyParser.json()); // Позволяет передавать в body запроса json
app.use(bodyParser.urlencoded({ extended: false })); // позволяет передавать в body запроса key=value
// app.use(cookieParser()); // TODO: Зачем нужна?

// TODO: другой логгер, это так, потестить
console.log("API STARTED");

/*
req: https://ip/api/v1/reg/check_phone/params(phoneNumber)
 res: 200/404

 req: https://ip/api/v1/reg/check_phone/params(phoneNumber)
 res: 200/404 + key(52)

 req: https://ip/api/v1/reg/check_sms/params(code, phonenumber, key)
 res: 403/200

 наверно последнее действие должно быть отдельным запросом
 запрос тел.книги:
 req: https://ip/api/v1/app/get_phonebook/params(phonenumber, key)
 res: 403/200 + data

 */

// views
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'));

app.use(express.static(path.join(__dirname, 'public')));

require('./libs/connect')(app);

// routes
app.use('/api', api);


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
