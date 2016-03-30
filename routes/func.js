/*todo где это должно лежать?*/

/**
 * @method getJobName - для получения названия департамента, должности и компании
 * @param jobID
 * @param req
 * @param callback
 * @param companyID
 * */

function getJobParams(companyID, jobID, req, callback) {
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
          })
        }
      });
    }
  })
}


/**
 * @method checkUser - поверка регистрации польователя
 * @param phoneNumber
 * @param key
 * @param callback
 * @param req*/

function checkUser(phoneNumber, key, req, callback) {
  req.models.employees.find({phone_number: phoneNumber, key: key}, function (err, result) {
    if (err || !result[0]) {
      callback(500, null);
    } else {
      callback(200, result[0].id_company);
    }
  })
}

function sendSMS(phoneNumber, req, callback) {
  var smsCode = (Math.floor(Math.random() * (9999 - 1000) + 1000)).toString();
  // todo как то отправляем смс
  req.models.employees.find({phoneNumber: phoneNumber}, function (err, result) {
    result[0].sms_code = smsCode;
    result[0].save(function (err, result) {
      callback(err, result);
    })
  })
}


exports.checkUser = checkUser;
exports.getJobParams = getJobParams;
exports.sendSMS = sendSMS;