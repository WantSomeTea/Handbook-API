var express = require('express')
var router = express.Router()
var debug = require('debug')('app:routes:employees')
var controller = require('../controllers/employees')

router.use(function (req, res, next) {
  console.log('Employees API request')
  next()
})

/**
 * @api {get} /v1/app/employees/ Employees
 * @apiName Employees:GET
 * @apiGroup group
 *
 * @apiParam {String} phoneNumber
 * @apiParam {String} key
 *
 * @apiSuccess {Object} Книга контактов
 */
router.route('')
  .get(function (req, res) {
    controller.employeesWithCompanyID(req, function (err, book) {
      debug(''+err+' '+book)
      if (err) {
        debug(err.message)
        res.status(err.status).send()
      } else {
        // debug(book)
        res.send(book)
      }
    })
  })

// Нужна ли будет функция в будущем?
router.route('/:userId')
  // GET contact by userId
  .get(function (req, res) {
    var user = {name: 'Alex', department: 'New'} // TODO: Выдавать объект из базы данных
    // получить пользователя по имени и департаменту
    // список доступных моделей libs/defineModels
    req.models.employees.find(user, function (err, result) {
      if (err) {
        console.log(err)
      } else {
        res.send(result[0])
      }
    })
    // res.json(user)
  })

module.exports = router
