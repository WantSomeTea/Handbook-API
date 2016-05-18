var express = require('express')
var router = express.Router()
var checkAuth = require('./../middleware/checkAuth')
var company = require('./../middleware/getSettings')

router.get('/', checkAuth, company, function (req, res, next) {
  res.render('index', {
    title: req.company.name,
    username: req.session.user.username
  })
})

router.get('/signin', function (req, res, next) {
  res.render('signin')
})

router.post('/signout', function (req, res) {
  req.session.destroy()
  res.redirect('/signin')
})

module.exports = router
