/**
 * Created by pavtr_000 on 28.03.2016.
 */
/*todo где это должно лежать?*/
/**
 * @method getJobName - для получения названия департамента, должности и компании
 * @param jobID
 * @param req
 * @param callback
 * @param companyID
 * */

function getJobParams (companyID, jobID, req, callback) {
  var jobEmployee = {};
  req.models.company.find({id_company: companyID}, function (err, result) {
    if(err){
      jobEmployee.companyName = null;
    } else {
      jobEmployee.companyName = result[0].name;
      req.models.job.find({id_job: jobID}, function (err, result) {
        if(err) {
          jobEmployee.jobName = null;
        } else {
          jobEmployee.jobName = result[0].name;
          req.models.department.find({id_department: result[0].id_department}, function (err, result) {
            if(err){
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

function checkUser (phoneNumber, key, req, callback) {
  req.models.employees.find({phone_number: phoneNumber, key: key}, function (err, result) {
    if(err || !result[0]) {
      callback(500);
    } else {
      callback(200, result[0].id_company);
    }
  })
}

function sendSMS (phoneNumber, callback ) {
  /*todo что то делаем*/
}


exports.checkUser = checkUser;
exports.getJobParams = getJobParams;
exports.sendSMS = sendSMS;