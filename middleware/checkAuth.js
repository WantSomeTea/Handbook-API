var debug = require('debug')('app:middleware:checkAuth')

module.exports = function (req, res, next) {
  debug('checkAuth middleware')
  debug('session.user ' + req.session.user)
  if (req.session.user) {
    debug('checkAuth middleware next')
    next()
  } else {
    debug('checkAuth middleware else')
    res.set('Content-Type', 'text/html')
    res.status(401).send('<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/signin"></head></html>')
  }
}
