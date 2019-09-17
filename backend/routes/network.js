const express = require('express');

const NetworkController = require('../controllers/network');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, NetworkController.create);

router.put('/:networkId', checkAuth, NetworkController.update);

router.get('', NetworkController.getAll);

router.get('/:networkId', NetworkController.get);

router.delete('/:networkId', checkAuth, NetworkController.delete);

module.exports = router;
