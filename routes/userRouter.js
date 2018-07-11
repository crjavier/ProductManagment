// dependencies
const express = require('express');

// models
const User = require('../models/User');

// static
const router = express.Router();

router.post('/', (req, res) => {
  User.create(req.body)

    .then(newUser => (
      res.status(201).json(newUser.toJSON())
    ));
});

router.get('/', (req, res) => {
  User.find()

    .then(users => (
      res.status(200).json(users)
    ));
});

module.exports = router;
