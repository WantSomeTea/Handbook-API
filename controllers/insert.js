var crypt = require('../libs/crypt');

exports.insertEmployees = function(req, callback) {
  var second_name = req.query.secondName;
  var middle_name = req.query.middleName;
  var first_name = req.query.firstName;
  var phone_number = req.query.phoneNumber;
  var work_number = req.query.workNumber;
  var email = req.query.email;
  var additional_numbers = req.query.additionalNumbs;
  var id = req.query.id;
  req.models.employees.find({id_employee: id}, function(err, result) {
    if (err) {
      console.log(err);
      callback(err);
    } else if(result[0] == undefined) {
      callback("empty response");
    } else {
      result[0].second_name = crypt.encrypt(second_name);
      result[0].middle_name = crypt.encrypt(middle_name);
      result[0].first_name = crypt.encrypt(first_name);
      result[0].phone_number = crypt.encrypt(phone_number);
      result[0].work_number = crypt.encrypt(work_number);
      result[0].email = crypt.encrypt(email);
      result[0].additional_numbers = crypt.encrypt(additional_numbers);
      result[0].save(function(err) {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    }
  });
}
