/**
 * Custom Error
 * error(400,"Wrong request");
 */
module.exports = function (status, message) {
  var error = new Error(message);
  error.status = status;
  return error;
};
