const express = require('express');

const QueController = require('../controllers/que');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, QueController.create);

router.get('', QueController.getAll);

router.delete('/:queId', checkAuth, QueController.delete);


module.exports = router;
