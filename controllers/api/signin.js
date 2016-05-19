/**
 * Created by pavtr_000 on 11.03.2016.
 */
var async = require('async')
var pwd = require('pwd')
var error = require('./../../libs/error')
var express = require('express')
var router = express.Router()

router.post('/signin', function (req, res, next) {
  var username = req.query.username
  var password = req.query.password
  console.log(username + ' ' + password)
  async.waterfall([
    function (callback) {
      console.log('Almost .find')
      req.models.admin.find({username: username}, callback)
    },
    function (user, callback) {
      if (user.length !== 0) {
        pwd.hash(password, user[0].salt, function (err, hash) {
          if (err) {
            console.log(err)
            callback(err)
          }
          if (user[0].hash == hash) {
            console.log('Almost 200')
            callback(null, user)
          } else {
            console.log('Almost 404 1')
            next(error(404, 'Неверное имя пользователя или пароль'))
          }
        })
      } else {
        console.log('Almost 404 2')
        next(error(404, 'Неверное имя пользователя или пароль'))
      }
    }], function (err, user) {
    if (err) {
      console.log(err)
      next(error(500, 'Ошибка аутентификации'))
    } else if (user) {
      req.session.user = {
        id_company: user[0].id_company,
        username: user[0].username
      }
      console.log('Almost 200')
      res.send(200)
    }
  })
})

module.exports = router
