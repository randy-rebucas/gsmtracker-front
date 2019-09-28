const express = require('express');

const Controller = require('../../controllers/records/prescription');

const checkAuth = require('../../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, Controller.create);

router.put('/:prescriptionId', checkAuth, Controller.update);

router.get('', Controller.getAll);

router.get('/latest/:patientId', Controller.getCurrent);

router.get('/last/:patientId', Controller.getLast);

router.get('/:prescriptionId', Controller.get);

router.delete('/:prescriptionId', checkAuth, Controller.delete);


module.exports = router;
