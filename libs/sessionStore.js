module.exports = function (session) {
  var config = require('config')

  var cfg = config.get('redis')

  var RedisStore = require('connect-redis')(session)
  return new RedisStore({
    host: cfg.host,
    port: cfg.port
  })
}
