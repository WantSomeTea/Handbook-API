var express = require('express');
var router = express.Router();
var keygen = require('keygen');
var func = require('./func');

router.use(function(req, res, next) {
  console.log("Contacts API request");
  next();
});

router.route('/check_phone')
  .get(function(req, res, next) {
    var phoneNumber = req.query.phoneNumber;
    req.models.employees.find({phone_number: phoneNumber}, function (err, result) {
      if(result[0]){
        var key = keygen.url(keygen.large);
        func.sendSMS(phoneNumber, function (err, result) {

        })
      } else {
        res.send(403);
      }
    })
  });

router.route('/check_sms')
  .get(function(req, res, next) {
    var smsCode = req.query.code;
    /*запутался в логике ...*/
  });

module.exports = router;
