const express = require('express');

const Controller = require('../../controllers/records/temperature');

const checkAuth = require('../../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, Controller.create);

router.put('/:temperatureId', checkAuth, Controller.update);

router.get('', Controller.getAll);

router.get('/last/:patientId', Controller.getLast);

router.get('/latest/:patientId', Controller.getCurrent);

router.get('/:temperatureId', Controller.get);

router.delete('/:temperatureId', checkAuth, Controller.delete);

module.exports = router;
