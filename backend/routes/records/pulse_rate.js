const express = require('express');

const Controller = require('../../controllers/records/pulse_rate');

const checkAuth = require('../../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, Controller.create);

router.put('/:pulseRateId', checkAuth, Controller.update);

router.get('', Controller.getAll);

router.get('/last/:patientId', Controller.getLast);

router.get('/latest/:patientId', Controller.getCurrent);

router.get('/:pulseRateId', Controller.get);

router.delete('/:pulseRateId', checkAuth, Controller.delete);

module.exports = router;
