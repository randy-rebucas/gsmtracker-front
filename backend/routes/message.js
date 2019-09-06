const express = require('express');

const MessageController = require('../controllers/message');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, MessageController.create); //extractFile,

router.get('', MessageController.getAll);

router.delete('/:messageId', checkAuth, MessageController.delete);


module.exports = router;
