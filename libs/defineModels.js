module.exports = function (db, models) {
  models.employees = require('./../models/employees')(db)
  models.companies = require('./../models/companies')(db)
  models.departments = require('./../models/departments')(db)
  models.job = require('./../models/job')(db)
  models.admin = require('./../models/admin')(db)
}
