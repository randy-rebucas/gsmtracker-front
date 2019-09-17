const express = require('express');

const PatientController = require('../controllers/patient');

const checkAuth = require('../middleware/check-auth');

const preAuth = require('../middleware/auth');

const router = express.Router();

router.post('', checkAuth, preAuth, PatientController.createPatient);

router.get('', PatientController.getPatients);

router.get('/:patientId', PatientController.getPatient);

router.put('/:patientId/:personId', checkAuth, preAuth, PatientController.updatePatient);
/**
 * to be remove
 */
router.get('/network', PatientController.getAllNetwork);

router.delete('/:patientId', checkAuth, PatientController.deletePatient);


module.exports = router;
