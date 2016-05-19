/**
 * Created by pavtr_000 on 21.03.2016.
 */
var crypt = require('../libs/crypt');

module.exports = function (db) {
  return db.define('employees', {
    id_employee: {
      type: 'number',
      required: true,
      key: true,
      unique: true
    },
    second_name: {
      type: 'binary'
    },
    middle_name: {
      type: 'binary'
    },
    first_name: {
      type: 'binary',
      required: true
    },
    phone_number: {
      type: 'binary'
    },
    work_number: {
      type: 'binary'
    },
    email: {
      type: 'binary'
    },
    additional_numbers: {
      type: 'binary'
    },
    id_company: {
      type: 'number',
      required: true
    },
    id_job: {
      type: 'number',
      required: true
    },
    key: {
      type: 'text'
    },
    sms_code: {
      type: 'text'
    }
  }, {
    methods: {
      fullName: function () {
        var secondName = crypt.decrypt(this.second_name);
        var firstName = crypt.decrypt(this.first_name);
        var middleName = crypt.decrypt(this.middle_name);
        return secondName + ' ' + firstName + ' ' + middleName;
      }
    }
  });
};
