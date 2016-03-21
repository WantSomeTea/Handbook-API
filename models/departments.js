/**
 * Created by pavtr_000 on 21.03.2016.
 */
module.exports = function (db) {
  return db.define('departments', {
    id_department: {
      type: 'number',
      required: true,
      unique: true,
      key: true
    },
    name: {
      type: 'text'
    },
    id_company: {
      type: 'number',
      required: true
    }
  });
};