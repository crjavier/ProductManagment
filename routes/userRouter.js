// dependencies
const express = require('express');

// controllers
const { register, retrieve } = require('../controllers/userController');

// statics
const router = express.Router();

router.post('/register', register);
router.get('/retrieve', retrieve);

module.exports = router;
