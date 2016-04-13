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
        console.error(err.message);
        res.status(err.status).send();
      } else {
        debug(''+phone);
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
        console.error(err.message);
        res.status(err.status).send();
      } else {
        res.status(200).json({
          "requests": {
            "employees": "/api/v1/app/employees"
          },
          "key": key
        });
      }
    });
  });

module.exports = router;
