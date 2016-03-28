var express = require('express');
var router = express.Router();
var keygen = require('keygen');
var func = require('./func');

router.use(function (req, res, next) {
  console.log("Contacts API request");
  next();
});

router.route('/check_phone')
  .get(function (req, res, next) {
    var phoneNumber = req.query.phoneNumber;
    req.models.employees.find({phone_number: phoneNumber}, function (err, result) {
      if (result[0]) {
        var key = keygen.url(keygen.large);
        result[0].save({key: key}, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            func.sendSMS(phoneNumber, req, function (err, result) {
              if (err) {
                console.log(err); //и какой то статус (сообщение не ушло)
              } else {
                res.send(key);
              }
            })
          }
        })
      } else {
        res.send(403);
      }
    })
  });

router.route('/check_sms')
  .get(function (req, res, next) {
    var smsCode = req.query.code;
    var key = req.query.key;
    var phoneNumber = req.query.phoneNumber;

    req.models.employees.find({phoneNumber: phoneNumber, key: key}, function (err, result) {
      if (err) {
        res.send(403);
      } else if (result[0].sms_code == smsCode) {
        res.send(200);
      }
    })

  });

module.exports = router;
