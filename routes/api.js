var express = require('express')
var router = express.Router()

var register = require('./register')
var employees = require('./employees')
var insert = require('./insert')

var checkAuth = require('./../middleware/checkAuth')
var employeesPortal = require('./../controllers/api/employees')
var signin = require('./../controllers/api/signin')
var settings = require('./../controllers/api/settings')

/* GET home page. */
router.get('/', function (req, res) {
  res.status(200).send('API status OK')
})

router.use('/v1/reg', register)
router.use('/v1/app/employees', employees)
router.use('/v1/insert/employees', insert)

router.use('/employees', checkAuth, employeesPortal)
router.use('/signin', signin)
router.use('/settings', checkAuth, settings)

module.exports = router
