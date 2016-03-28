var express = require('express');
var router = express.Router();
var async = require('async');
var func = require('./func');

router.use(function(req, res, next) {
  console.log("Contacts API request");
  next();
});

router.route('/get_phonebook')
  .get(function (req, res, next) {
     var phoneNumber = req.query.phoneNumber; /*todo это если запрос в виде /get_PB?phoneNumber=11111&key=qwe*/
     var key = req.query.key;

    func.checkUser(phoneNumber, key, req, function (authStatus, idCompany) {
      if(authStatus == 200) {
        req.models.employees.find({id_company: idCompany}, function (err, result) {
          if(err) {
            console.log(err);
          } else {
            var resObj = [];
            async.forEach(result, function (employee, callback) {
              func.getJobParams(employee.id_company, employee.id_job, req, function (jobEmployee) {
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
              })
            }, function (err) {
              if(err) {
                console.log(err);
              } else {
                res.send(resObj);
              }
            })
          }
        })
      } else {
        res.send(403);
      }
    })
  });





router.route('/')
  // GET all employees
  .get(function(req, res) {
    var users = {}; // TODO: Выдавать все контакты из базы данных
    res.json(users);
  });

router.route('/:userId')
  // GET contact by userId
  .get(function(req, res) {
    var user = {name:"Alex", department:"New"}; // TODO: Выдавать объект из базы данных
    //получить пользователя по имени и департаменту
    /*список доступных моделей libs/defineModels*/
    req.models.employees.find(user, function (err, result) {
      if(err) {
        console.log(err);
      } else {
        res.send(result[0]);
      }/*fixme даааа, это x2 табы у Павла Трофимова :D*/
    });

    //res.json(user);
  });

module.exports = router;
