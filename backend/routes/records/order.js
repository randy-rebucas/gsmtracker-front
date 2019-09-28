const express = require('express');

const Controller = require('../../controllers/records/order');

const checkAuth = require('../../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, Controller.create);

router.put('/:orderId', checkAuth, Controller.update);

router.get('', Controller.getAll);

router.get('/latest', Controller.getCurrent);

router.get('/last/:orderId', Controller.getLast);

router.get('/:orderId', Controller.get);

router.delete('/:orderId', checkAuth, Controller.delete);


module.exports = router;
