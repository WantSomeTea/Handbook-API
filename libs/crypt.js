var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'NynuzoudXYZB3065138';

var encrypt = function (binary) {
  try {
    var text = binary.toString();
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  } catch (ex) {
    return;
  }
};

var decrypt = function (binary) {
  try {
    var text = binary.toString();
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    console.log(dec);
    return dec;
  } catch (ex) {
    return;
  }
};

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
