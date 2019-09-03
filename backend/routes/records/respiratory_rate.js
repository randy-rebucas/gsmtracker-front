const express = require('express');

const Controller = require('../../controllers/records/respiratory_rate');

const checkAuth = require('../../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, Controller.create);

router.put('/:respiratoryRateId', checkAuth, Controller.update);

router.get('', Controller.getAll);

router.get('/last/:patientId', Controller.getLast);

router.get('/latest/:patientId', Controller.getCurrent);

router.get('/:respiratoryRateId', Controller.get);

router.delete('/:respiratoryRateId', checkAuth, Controller.delete);

module.exports = router;
