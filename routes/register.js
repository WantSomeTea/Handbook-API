var express = require('express');
var router = express.Router();
var debug = require('debug')('app:routes:register');
var controller = require('../controllers/register');

router.use(function (req, res, next) {
  console.log("Register API request");
  next();
});

/**
 * @api {get} /v1/reg/check_phone [1] Check Phone
 * @apiName Register:checkPhoneAndSendSMS
 *
 * @apiParam {String} phoneNumber
 *
 * @apiSuccess {String} key
 */
/*
router.route('/check_phone')
  .get(function (req, res) {
    controller.checkPhoneAndSendSMS(req, function(err, key) {
      if (err) {
        res.status(err.status).send();
      } else {
        res.status(200).json({
          "check_sms": "/api/v1/reg/check_sms",
          "get_phonebook": "/api/v1/app/get_phonebook",
          "key": key
        });
      }
    });
  });
*/
/**
 * @api {get} /v1/reg/check_sms [2] Check SMS
 * @apiName Register:checkSMS
 *
 * @apiParam {String} phoneNumber
 * @apiParam {String} smsCode
 * @apiParam {String} key
 *
 * @apiSuccess {Status} 200
 */
/*
router.route('/check_sms')
  .get(function (req, res) {
    controller.checkSMS(req, function(err, result) {
      if (err) {
        res.status(err.status).send();
      } else {
        debug(result);
        res.status(200).send();
      }
    });
  });
*/

/**
 * @api {get} /v1/reg/check_phone [1] Check Phone
 * @apiName Register:checkPhone
 *
 * @apiParam {String} phoneNumber
 *
 * @apiSuccess {Status} 200 OK
 */
router.route('/check_phone')
  .get(function (req, res) {
    controller.checkPhone(req, function(err, phone) {
      if (err) {
        res.status(err.status).send();
      } else {
        res.status(200).send();
      }
    });
  });

/**
 * @api {get} /v1/reg/register [2] Register
 * @apiName Register:register
 *
 * @apiParam {String} phoneNumber
 *
 * @apiSuccess {Object} json
 *               {Object} requests Объект с ключом-названием функции и значением-адресом
 *               {String} key Ключ для работы с API

 */
router.route('/register')
  .get(function (req, res) {
    controller.register(req, function(err, key) {
      if (err) {
        res.status(err.status).send();
      } else {
        res.status(200).json({
          "requests": {
            "check_sms": "/api/v1/reg/check_sms",
            "get_phonebook": "/api/v1/app/get_phonebook"
          },
          "key": key
        });
      }
    });
  });


module.exports = router;
