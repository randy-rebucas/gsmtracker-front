const express = require('express');

const Controller = require('../controllers/encounter');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('', Controller.getAll);

router.put('/:myUserId', checkAuth, Controller.update);

router.post('', checkAuth, Controller.create);

module.exports = router;
