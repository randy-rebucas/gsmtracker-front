const express = require('express');

const UserController = require('../controllers/user');

const preAuth = require('../middleware/auth');

const router = express.Router();

router.post('/signup', preAuth, UserController.createUser);

router.post('/login', UserController.userLogin);

module.exports = router;
