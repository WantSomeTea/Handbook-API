var keygen = require('keygen');
var httpError = require('../libs/error');

/**
 * Проверка телефона
 * 400
 * 500
 * 200/телефон
 */
/**
 * Проверка на наличие телефона и отправка SMS на номер
 * @method checkPhoneAndSendSMS
 * @param  {[type]}   req      [description]
 * @param  {Function} callback [description]
 * @return {String}            key
 */
exports.checkPhoneAndSendSMS = function(req, callback) {
  var phoneNumber = req.query.phoneNumber;
  req.models.employees.find({phone_number: phoneNumber}, function (err, result) {
    if (err) {
      callback(httpError(500, "Database Error (employees.find{phoneNumber})"), null);
    } else if (result[0] == undefined) {
      callback(httpError(400, "Empty result (employees.find{phoneNumber})"), null); // NOTE: Или 403?
    } else {
      var key = keygen.url(keygen.large);
      result[0].save({key: key}, function (err, result) {
        if (err) {
          callback(httpError(500, "Database Error (result[0].save{key})"), null);
        } else {
          var smsCode = (Math.floor(Math.random() * (9999 - 1000) + 1000)).toString();
          result[0].sms_code = smsCode;
          result[0].save(function (err) {
            if (err) {
              callback(httpError(500, "Database Error (result[0].save{})"), null);
            } else {
              // TODO: как-то отправляем смс
              callback(null, key);
            }
          });
        }
      });
    }
  });
};

/**
 * Проверка SMS
 * @method checkSMS
 * @param  {[type]}   req      [description]
 * @param  {Function} callback [description]
 * @return {object}            Результат функции employees.find
 */
exports.checkSMS = function(req, callback) {
  var smsCode = req.query.code;
  var key = req.query.key;
  var phoneNumber = req.query.phoneNumber;

  req.models.employees.find({phoneNumber: phoneNumber, key: key}, function (err, result) {
    if (err) {
      callback(httpError(500, "Database Error"), null);
    } else if (result[0] == undefined) {
      callback(httpError(400, "Empty result"), null);
    } else {
      if (result[0].sms_code == '1010') {
        callback(null, result); //NOTE: Чит-код 1010
      } else if (result[0].sms_code !== smsCode) {
        callback(httpError(403, "Wrong SMS code"), null);
      } else {
        callback(null, result);
      }
    }
  });
};
