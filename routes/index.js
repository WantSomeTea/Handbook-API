var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send("It works.");
});

var contacts = require('./contacts');

router.use('/contacts', contacts);

module.exports = router;
