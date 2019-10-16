const express = require('express');
const router = express.Router();
/**
 * loads middlewares
 */
const checkAuth = require('../middleware/check-auth');
const preAuth = require('../middleware/auth');
const extractFile = require('../middleware/file');
/**
 * load controller
 */
const UserController = require('../controllers/user');

router.post('/signup', preAuth, UserController.createUser);

router.post('/login', UserController.userLogin);

router.post('', checkAuth, preAuth, UserController.create);

router.post('/upload-profile-pic/:userId', extractFile, UserController.uploadProfile);

router.get('', UserController.getAll);

router.get('/:userId', UserController.get);

router.get('/new/:licenseId', UserController.getNewPatient);

router.get('/birthdays/:licenseId', UserController.getTodaysBirthday);

router.put('/:userId', checkAuth, preAuth, UserController.update);

router.delete('/:userId', checkAuth, UserController.delete);

router.delete('/many/:userIds', checkAuth, UserController.deleteMany);

module.exports = router;
