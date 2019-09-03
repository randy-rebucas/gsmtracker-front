const express = require('express');

const Controller = require('../../controllers/records/blood_pressure');

const checkAuth = require('../../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, Controller.create);

router.put('/:bloodPressureId', checkAuth, Controller.update);

router.get('', Controller.getAll);

router.get('/last/:patientId', Controller.getLast);

router.get('/latest/:patientId', Controller.getCurrent);

router.get('/:bloodPressureId', Controller.get);

router.delete('/:bloodPressureId', checkAuth, Controller.delete);

module.exports = router;