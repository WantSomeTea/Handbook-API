/**
 * Created by pavtr_000 on 21.03.2016.
 */

module.exports = function (db) {
  return db.define('employees', {
    id_employee: {
      type: 'number',
      required: true,
      key: true,
      unique: true
    },
    second_name: {
      type: 'text'
    },
    middle_name: {
      type: 'text'
    },
    first_name: {
      type: 'text',
      required: true
    },
    phone_number: {
      type: 'text'
    },
    work_number: {
      type: 'text'
    },
    email: {
      type: 'text'
    },
    additional_numbers: {
      type: 'text'
    },
    id_company: {
      type: 'number',
      required: true
    },
    id_job: {
      type: 'number',
      required: true
    },
    id_department: {
      type: 'number',
      required: true
    }
  }, {
    methods: {
      fullName: function () {
        return this.second_name + ' ' + this.first_name + ' ' + this.middle_name;
      }
    }
  });
};