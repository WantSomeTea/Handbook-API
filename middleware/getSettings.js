var debug = require('debug')('app:middleware:getSettings')

module.exports = function (req, res, next) {
  debug('getSettings middleware')
  if (!req.session.user) {
    debug('getSettings middleware next')
    return next()
  } else {
    debug('getSettings middleware else')
    req.models.companies.find({id_company: req.session.user.id_company}, function (err, company) {
      if (err) {
        debug('getSettings middleware err')
        return next(err)
      }
      req.company = company[0]
      next()
    })
  }
}
