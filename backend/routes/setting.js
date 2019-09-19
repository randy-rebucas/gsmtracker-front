const express = require('express');

const SettingController = require('../controllers/setting');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:licenseId', SettingController.get);

router.put('/:licenseId', checkAuth, SettingController.update);

router.post('', checkAuth, SettingController.create);

module.exports = router;
