const bcrypt = require('bcrypt-nodejs');

const encryptString = string => (
  new Promise((resolve, reject) => (
    bcrypt.genSalt(10, (err, salt) => (
      bcrypt.hash(string, salt, null, (hashErr, hash) => (
        hashErr ? reject(hashErr) : resolve(hash)
      ))
    ))
  ))
);

module.exports = {
  encryptString,
};
