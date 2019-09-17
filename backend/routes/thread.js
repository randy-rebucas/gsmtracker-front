const express = require('express');

const ThreadController = require('../controllers/thread');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, ThreadController.create);

router.get('', ThreadController.getAll);

router.get('/:threadId', ThreadController.get);

router.get('/last/:threadId', ThreadController.getLastMessage);

router.delete('/:threadId', checkAuth, ThreadController.delete);


module.exports = router;
