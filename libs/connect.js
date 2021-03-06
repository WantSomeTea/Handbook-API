/**
 * Created by pavtr_000 on 21.03.2016.
 */

var config = require('config');
var orm = require('orm');
var db = config.db;
module.exports = function (app) {
  orm.settings.set("instance.identityCache", false);
  orm.settings.set("instance.identityCacheSaveCheck", false);
  orm.settings.set("instance.autoSave", true);
  var ormConnect = 'mysql://' + db.user + ':' + db.password + '@' + db.host + ':' + db.port + '/' + db.base;
  app.use(orm.express(ormConnect, {
    define: function(db, models, next) {
      require('./defineModels')(db, models);
      next();
    }
  }));
};
