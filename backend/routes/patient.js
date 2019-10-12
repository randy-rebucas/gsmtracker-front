const express = require('express');

const PatientController = require('../controllers/patient');

const checkAuth = require('../middleware/check-auth');

const preAuth = require('../middleware/auth');

const router = express.Router();

router.post('', checkAuth, preAuth, PatientController.create);

router.get('', PatientController.getAll);

router.get('/search', PatientController.search);

router.get('/:patientId', PatientController.get);

router.get('/new/:licenseId', PatientController.getNewPatient);

router.put('/:patientId', checkAuth, preAuth, PatientController.update);

router.delete('/:patientId', checkAuth, PatientController.delete);



module.exports = router;
