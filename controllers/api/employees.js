var express = require('express')
var error = require('./../../libs/error')
var router = express.Router()
var orm = require('orm')
var debug = require('debug')('app:controllers:api:employees')
var crypt = require('../../libs/crypt')
var async = require('async')
var _ = require('lodash')
var rn = require('random-number')
var randomOpts = {
  min: 100000,
  max: 999999,
  integer: true
}
router.get('/search', function (req, res, next) {
  var page = parseInt(req.query.page)
  var offset = (page - 1) * req.query.limit
  offset = parseInt(offset < 0 ? 0 : offset)
  debug(req.session.user.id_company)

  var searchParams = {
    id_company: req.session.user.id_company,
    page: parseInt(req.query.page),
    limit: parseInt(req.query.limit),
    sort: req.query.sort,
    sortDir: req.query.sortDir,
    offset: offset
  }
  pageFilter(searchParams, req, function (err, objects) {
    if (err) {
      next(error(500, 'Ошибка, повторите попытку позже'))
    }
    // debug(objects.slice)
    res.send({
      objects: objects.slice,
      paginator: {
        currentPage: page,
        total: objects.objectsCount,
        lastPage: Math.ceil(objects.objectsCount / objects.limit)
      }
    })
  })
})

// add employee
router.post('/', function (req, res, next) {
  var newEmployee = {
    first_name: crypt.encrypt(req.body.first_name),
    middle_name: crypt.encrypt(req.body.middle_name),
    second_name: crypt.encrypt(req.body.second_name),
    id_employee: rn(randomOpts),
    phone_number: crypt.encrypt(req.body.phoneNumber),
    work_number: crypt.encrypt(req.body.workNumber),
    email: crypt.encrypt(req.body.email),
    id_company: req.session.user.id_company
  }
  getJobID(req.body.jobName, req, function (jobID) {
    newEmployee.id_job = jobID
    checkUser(newEmployee.phone_number, req, function (checkErr, checkResult) {
      if (checkErr) {
        next(error(400, 'error'))
      } else if (!checkResult) {
        req.models.employees.create(newEmployee, function (err, result) {
          if (err) {
            next(error(500, 'creating error'))
          } else {
            res.status(200).send()
          }
        })
      } else {
        req.models.employees.find({phone_number: newEmployee.phone_number}, function (err, result) {
          if (err) {
            next(error(400, 'error employees.find'))
          } else {
            result[0].save(newEmployee, function (err) {
              if (err) next(error(400, 'error result[0].save'))
              else res.status(200).send()
            })
          }
        })
      }
    })
  })
})

function getJobID (jobName, req, callback) {
  req.models.job.find({name: jobName}, function (err, result) {
    if (err) callback(null)
    else callback(result[0].id_job)
  })
}

function checkUser (phoneNumber, req, callback) {
  req.models.employees.find({phone_number: phoneNumber}, function (err, result) {
    if (err) callback(err, null)
    else callback(null, result[0])
  })
}

router.delete('/:phoneNumber', function (req, res, next) {
  var key = {
    id_company: req.session.user.id_company,
    phone_number: crypt.encrypt(req.params.phoneNumber)
  }
  req.models.employees.find(key).remove(function (err) {
    if (err) next(error(500, 'cant remove employee'))
    res.status(200).send()
  })
})

function pageFilter (params, req, callback) {
  getEmployeesList(req, params.id_company, function (err, employeesList) {
    if (err) {
      debug('pageFilter: 500, model error', {error: err})
    }
    var sortBy = _.sortBy(employeesList, params.sort)
    params.sortDir == 'Z' ? sortBy.reverse() : sortBy
    if (params.limit == 0) {
      params.limit = sortBy.length
    }
    var slice = _(sortBy).slice(params.offset).take(params.limit).value()
    var resultObj = {
      slice: slice,
      limit: params.limit,
      objectsCount: employeesList.length
    }
    callback(err, resultObj)
  })
}
function getJobParams (companyID, jobID, req, callback) {
  var jobEmployee = {}
  req.models.companies.find({id_company: companyID}, function (err, result) {
    if (err) {
      jobEmployee.companyName = null
    } else {
      jobEmployee.companyName = result[0].name
      req.models.job.find({id_job: jobID}, function (err, result) {
        if (err) {
          jobEmployee.jobName = null
        } else {
          jobEmployee.jobName = result[0].name
          req.models.departments.find({id_department: result[0].id_department}, function (err, result) {
            if (err) {
              jobEmployee.departmentName = null
            } else {
              jobEmployee.departmentName = result[0].name
              callback(jobEmployee)
            }
          })
        }
      })
    }
  })
}

function getEmployeesList (req, idCompany, callback) {
  req.models.employees.find({id_company: idCompany}, function (err, result) {
    if (err) {
      callback(err)
    } else {
      var resObj = []
      async.forEach(result, function (employee, callback) {
        getJobParams(employee.id_company, employee.id_job, req, function (jobEmployee) {
          var obj = {
            second_name: crypt.decrypt(employee.second_name),
            first_name: crypt.decrypt(employee.first_name),
            middle_name: crypt.decrypt(employee.middle_name),
            phoneNumber: crypt.decrypt(employee.phone_number),
            workNumber: crypt.decrypt(employee.work_number),
            email: crypt.decrypt(employee.email),
            additionalNumbs: crypt.decrypt(employee.additional_numbers),
            companyName: jobEmployee.companyName,
            jobName: jobEmployee.jobName,
            departmentName: jobEmployee.departmentName
          }
          resObj.push(obj)
          callback()
        })
      }, function (err) {
        if (err) {
          callback(err)
        } else {
          callback(err, resObj)
        }
      })
    }
  })
}

module.exports = router
