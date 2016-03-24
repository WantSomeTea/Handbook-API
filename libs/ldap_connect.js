var ldap = require('ldap');

var client = ldap.createClient({
  url: 'ldap://127.0.0.1:1389/CN=test,OU=Development,DC=Home'
});

var opts = {
  filter: '(objectclass=user)',
  scope: 'sub',
  attributes: ['objectGUID']
};

client.bind('username', 'password', function (err) {
  client.search('CN=test,OU=Development,DC=Home', opts, function (err, search) {
    search.on('searchEntry', function (entry) {
      var user = entry.object;
      console.log(user.objectGUID);
    });
  });
});
