const express = require('express');

const SettingController = require('../controllers/setting');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:id', SettingController.get);

router.put('/:id', checkAuth, SettingController.update);

router.post('', checkAuth, SettingController.create); //checkAuth,

module.exports = router;
