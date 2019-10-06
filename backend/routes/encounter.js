const express = require('express');

const Controller = require('../controllers/encounter');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:encounterId', Controller.get);

router.put('/:userId/:licenseId', checkAuth, Controller.update);

router.post('', checkAuth, Controller.create);

module.exports = router;
