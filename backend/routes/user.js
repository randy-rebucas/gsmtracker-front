const express = require('express');

const UserController = require('../controllers/user');

const checkAuth = require('../middleware/check-auth');

const preAuth = require('../middleware/auth');
const extractFile = require('../middleware/file');
const resizeFile = require('../middleware/resize');

const router = express.Router();

router.post('/signup', preAuth, UserController.createUser);

router.post('/login', UserController.userLogin);

router.post('', checkAuth, preAuth, UserController.create);

router.get('', UserController.getAll);

router.get('/:userId', UserController.get);

router.put('/:userId', checkAuth, preAuth, UserController.update);

router.delete('/:userId', checkAuth, UserController.delete);

router.post('/upload-profile-pic/:userId', extractFile, UserController.uploadProfile);

module.exports = router;