/**
 * @method getJobName - для получения названия департамента, должности и компании
 * @param jobID
 * @param req
 * @param callback
 * @param companyID
 * */

exports.getJobParams = function(companyID, jobID, req, callback) {
  var jobEmployee = {};
  req.models.companies.find({id_company: companyID}, function (err, result) {
    if (err) {
      jobEmployee.companyName = null;
    } else {
      jobEmployee.companyName = result[0].name;
      req.models.job.find({id_job: jobID}, function (err, result) {
        if (err) {
          jobEmployee.jobName = null;
        } else {
          jobEmployee.jobName = result[0].name;
          req.models.departments.find({id_department: result[0].id_department}, function (err, result) {
            if (err) {
              jobEmployee.departmentName = null;
            } else {
              jobEmployee.departmentName = result[0].name;
              callback(jobEmployee);
            }
          });
        }
      });
    }
  });
};

/**
 * @method checkUser - поверка регистрации польователя
 * @param phoneNumber
 * @param key
 * @param callback
 * @param req*/

exports.checkUser = function(phoneNumber, key, req, callback) {
  req.models.employees.find({phone_number: phoneNumber, key: key}, function (err, result) {
    if (err || !result[0]) {
      callback(500, null);
    } else {
      callback(200, result[0].id_company);
    }
  });
};

/**
 * Отправка SMS
 * 400
 * 500
 * 200
 */
exports.sendSMS = function (req, callback) {
  var smsCode = (Math.floor(Math.random() * (9999 - 1000) + 1000)).toString();
  //TODO: как то отправляем смс
  
  var phoneNumber = req.query.phoneNumber;
  req.models.employees.find({phone_number: phoneNumber}, function (err, result) {
    if (result[0]) {
      var key = keygen.url(keygen.large);
      result[0].save({key: key}, function (err, result) {
        if (err) {
          console.log(err);
          res.sendStatus(400);
        } else {
          func.sendSMS(phoneNumber, req, function (err, result) {
            if (err) {
              console.log(err); //и какой то статус (сообщение не ушло)
              res.sendStatus(400);
            } else {
              res.send(key);
            }
          });
        }
      });
    } else {
      res.send(403);
    }
  });
  req.models.employees.find({phoneNumber: phoneNumber}, function (err, result) {
    result[0].sms_code = smsCode;
    result[0].save(function (err, result) {
      callback(err, result);
    });
  });
};

/**
 * Проверка SMS- кода
 * 400
 * 403
 * 200
 */
exports.checkSMS = function(req, callback) {
  var smsCode = req.query.code;
  var key = req.query.key;
  var phoneNumber = req.query.phoneNumber;

  req.models.employees.find({phoneNumber: phoneNumber, key: key}, function (err, result) {
    if (err) {
      callback(400, null);
    } else {
      if (result[0].sms_code !== smsCode) {
        callback(403, null);
      } else {
        callback(null, result);
      }
    }
  });
};

exports.getJobParams = getJobParams;
