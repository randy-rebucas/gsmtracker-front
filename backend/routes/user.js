const express = require('express');
const router = express.Router();
/**
 * loads middlewares
 */
const checkAuth = require('../middleware/check-auth');
// const preAuth = require('../middleware/auth');
const extractFile = require('../middleware/file');
/**
 * load controller
 */
const UserController = require('../controllers/user');

router.post('/signup', UserController.createUser);

router.post('/login', UserController.userLogin);

router.post('', checkAuth, UserController.create); // preAuth,

router.post('/upload-profile-pic/:userId', extractFile, UserController.uploadProfile);

router.get('', UserController.getAll);

router.get('/:myUserId', UserController.get);

router.get('/new/:licenseId', UserController.getNewUser);

router.get('/birthdays/:licenseId', UserController.getTodaysBirthday);

router.get('/search', UserController.search);

router.put('/:myUserId', checkAuth, UserController.update); // preAuth,

router.delete('/:myUserId', checkAuth, UserController.delete);

router.delete('/many/:userIds', checkAuth, UserController.deleteMany);

module.exports = router;
