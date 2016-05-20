var async = require('async')
var pwd = require('pwd')
var error = require('./../../libs/error')
var express = require('express')
var router = express.Router()
var debug = require('debug')('app:controllers:api:signin')

router.post('/signin', function (req, res, next) {
  var username = req.query.username
  var password = req.query.password
  debug(username + ' ' + password)
  async.waterfall([
    function (callback) {
      debug('Almost .find')
      req.models.admin.find({username: username}, callback)
    },
    function (user, callback) {
      if (user.length !== 0) {
        pwd.hash(password, user[0].salt, function (err, hash) {
          if (err) {
            debug(err)
            callback(err)
          }
          if (user[0].hash == hash) {
            debug('Almost 200 1')
            callback(null, user)
          } else {
            debug('Almost 404 1')
            next(error(404, 'Неверное имя пользователя или пароль'))
          }
        })
      } else {
        debug('Almost 404 2')
        next(error(404, 'Неверное имя пользователя или пароль'))
      }
    }], function (err, user) {
    if (err) {
      debug(err.message)
      next(error(500, 'Ошибка аутентификации'))
    } else if (user) {
      req.session.user = {
        id_company: user[0].id_company,
        username: user[0].username
      }
      debug('Almost 200 finish')
      res.status(200).send()
    }
  })
})

module.exports = router
