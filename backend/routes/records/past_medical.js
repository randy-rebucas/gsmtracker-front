const express = require('express');

const Controller = require('../../controllers/records/past_medical');

const checkAuth = require('../../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, Controller.create);

router.put('/:pastMedicalId', checkAuth, Controller.update);

router.get('', Controller.getAll);

router.get('/latest', Controller.getCurrent);

router.get('/last/:patientId', Controller.getLast);

router.get('/:pastMedicalId', Controller.get);

router.delete('/:pastMedicalId', checkAuth, Controller.delete);


module.exports = router;
