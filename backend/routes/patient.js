const express = require('express');

const PatientController = require('../controllers/patient');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();

router.post('', checkAuth, PatientController.createPatient); //extractFile,

router.put('/:patientId/:personId', checkAuth, PatientController.updatePatient); //extractFile,

router.get('', PatientController.getPatients);

router.get('/network', PatientController.getAllNetwork);

router.get('/:patientId', PatientController.getPatient);

router.delete('/:patientId', checkAuth, PatientController.deletePatient);


module.exports = router;
