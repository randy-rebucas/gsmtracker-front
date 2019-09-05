const express = require('express');

const ThreadController = require('../controllers/thread');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();

router.post('', checkAuth, ThreadController.create); //extractFile,

router.get('', ThreadController.getAll);

router.get('/:id', ThreadController.get);

router.delete('/:id', checkAuth, ThreadController.delete);


module.exports = router;
