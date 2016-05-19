var express = require('express');
var router = express.Router();
var debug = require('debug')('app:routes:employees');
var controller = require('../controllers/insert');

router.use(function (req, res, next) {
  console.log("Employees API insert request");
  next();
});

router.route('')
  .get(function (req, res) {
    controller.insertEmployees(req, function(err) {
      if (err) {
        console.error(err.message);
        res.status(err).send();
      } else {
        res.status(200).send();
      }
    });
  });

module.exports = router;
