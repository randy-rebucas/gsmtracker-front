const express = require('express');

const SettingController = require('../controllers/setting');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:userId', SettingController.get);

router.put('/:userId', checkAuth, SettingController.update);

router.post('', checkAuth, SettingController.create); //checkAuth,

module.exports = router;
