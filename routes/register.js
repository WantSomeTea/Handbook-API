var express = require('express');
var router = express.Router();
var debug = require('debug')('routes:register');
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
router.route('/check_phone')
  .get(function (req, res) {
    controller.checkPhoneAndSendSMS(req, function(err, key) {
      if (err) {
        res.status(err.status).send();
      } else {
        res.status(200).send(key);
      }
    });
  });

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

module.exports = router;
