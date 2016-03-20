var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
  console.log("Contacts API request");
  next();
});

router.route('/')
  // GET all contacts
  .get(function(req, res) {
    var users = {}; // TODO: Выдавать все контакты из базы данных
    res.json(users);
  });

router.route('/:userId')
  // GET contact by userId
  .get(function(req, res) {
    var user = {name:"Alex", department:"New"}; // TODO: Выдавать объект из базы данных
    res.json(user);
  });

module.exports = router;
