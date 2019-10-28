const express = require('express');

const QueController = require('../controllers/que');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, QueController.create);

router.get('', QueController.getAll);

router.get('/:myUserId', QueController.get);

router.delete('/:queId', checkAuth, QueController.delete);

router.delete('/clear/', checkAuth, QueController.deleteAll);

router.delete('/smooth/:myUserId', checkAuth, QueController.deleteSmooth);

router.delete('/cancel/:myUserId', checkAuth, QueController.deleteCanceled);

module.exports = router;
