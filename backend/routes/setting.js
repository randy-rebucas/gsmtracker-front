const express = require('express');

const SettingController = require('../controllers/setting');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();
const extractFile = require('../middleware/file');

router.get('/', SettingController.get);

router.put('/', checkAuth, SettingController.update);

router.post('', checkAuth, SettingController.create);

router.post('/upload-logo/:settingId', extractFile, SettingController.uploadLogo);

module.exports = router;
