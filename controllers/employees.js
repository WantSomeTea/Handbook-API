var async = require('async');
var httpError = require('../libs/error');
var debug = require('debug')('app:controllers:employees');
var crypt = require('../libs/crypt');

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
          });
        }
      });
    }
  });
}

exports.employeesWithCompanyID = function(req, callback) {
  var phoneNumber = req.query.phoneNumber;
  var key = req.query.key;
  debug(phoneNumber);
  debug(key);
  phoneNumber = crypt.encrypt(phoneNumber);
  req.models.employees.find({phone_number: phoneNumber, key: key}, function (err, result) {
    if (err || !result[0]) {
      debug(err);
      callback(httpError(500, "Database error (employees.find{phoneNumber,key})"), null);
    } else if (result[0] == undefined) {
      callback(httpError(400, "Empty result (employees.find{phoneNumber,key})"), null); //NOTE: Или 403?
    } else {
      var idCompany = result[0].id_company;
      req.models.employees.find({id_company: idCompany}, function (err, result) {
        if (err) {
          callback(httpError(500, "Database error (employees.find{idCompany})"), null);
        } else {
          var resObj = [];
          async.forEach(result, function (employee, callback) {
            getJobParams(employee.id_company, employee.id_job, req, function (jobEmployee) {
              var obj = {
                name: employee.fullName(),
                phoneNumber: crypt.decrypt(employee.phone_number),
                workNumber: crypt.decrypt(employee.work_number),
                email: crypt.decrypt(employee.email),
                additionalNumbs: crypt.decrypt(employee.additional_numbers),
                companyName: jobEmployee.companyName,
                jobName: jobEmployee.jobName,
                departmentName: jobEmployee.departmentName
              };
              console.log(1);
              resObj.push(obj);
              console.log(2);
              callback();
            });
          }, function (err) {
            console.log(3);
            if (err) {
              callback(httpError(500, "Async error"), null);
            } else {
              debug(resObj);
              callback(null, resObj);
            }
          });
        }
      });
    }
  });
};
