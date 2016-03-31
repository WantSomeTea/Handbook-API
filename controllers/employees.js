var async = require('async');
var httpError = require('../libs/error');
var debug = require('debug')('controllers:employees');

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
  /*TODO: это если запрос в виде /get_PB?phoneNumber=11111&key=qwe*/
  var key = req.query.key;

  req.models.employees.find({phone_number: phoneNumber, key: key}, function (err, result) {
    if (err || !result[0]) {
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
                phoneNumber: employee.phone_number,
                workNumber: employee.work_number,
                email: employee.email,
                additionalNumbs: employee.additional_numbers,
                companyName: jobEmployee.companyName,
                jobName: jobEmployee.jobName,
                departmentName: jobEmployee.departmentName
              };
              resObj.push(obj);
              callback();
            });
          }, function (err) {
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
