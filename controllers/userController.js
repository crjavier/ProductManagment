const User = require('../models/User');

const register = (req, res) => (
  // step #1: validate request body
  User.validateBody(req.body)

    // step #2: create user from valid body
    .then(validBody => (
      User.create(validBody)
    ))

    // step #3: send user info to client
    .then(user => (
      res.status(200).json(user.toJSON())
    ))

    // error handler
    .catch(err => (
      res.status(400).json(err)
    ))
);

const retrieve = (req, res) => (
  User.find()

    .then(users => (
      res.status(200).json(users)
    ))
);

module.exports = {
  register,
  retrieve,
};
