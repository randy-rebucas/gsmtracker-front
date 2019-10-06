const express = require('express');

const QueController = require('../controllers/que');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, QueController.create);

router.get('', QueController.getAll);

router.get('/:userId', QueController.get);

router.delete('/:queId', checkAuth, QueController.delete);

router.delete('/clear/:licenseId', checkAuth, QueController.deleteAll);

router.delete('/smooth/:userId', checkAuth, QueController.deleteSmooth);

router.delete('/cancel/:userId', checkAuth, QueController.deleteCanceled);

module.exports = router;
