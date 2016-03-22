var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
  console.log("Contacts API request");
  next();
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
