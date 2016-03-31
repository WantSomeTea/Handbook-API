var express = require('express');
var router = express.Router();
var register = require('./register');
var employees = require('./employees');

/* GET home page. */
router.get('/', function(req, res) {
  res.status(200).send("API status OK");
});

router.use('/v1/reg', register);
router.use('/v1/app/employees', employees);

module.exports = router;
