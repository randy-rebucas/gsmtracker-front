const express = require('express');

const PatientController = require('../controllers/patient');

const checkAuth = require('../middleware/check-auth');

const preAuth = require('../middleware/auth');

const router = express.Router();

router.post('', checkAuth, preAuth, PatientController.create);

router.get('', PatientController.getAll);

router.get('/:patientId', PatientController.get);

router.put('/:patientId', checkAuth, preAuth, PatientController.update);

router.delete('/:patientId', checkAuth, PatientController.delete);

/**
 * to be remove
 */
router.get('/network', PatientController.getAllNetwork);

module.exports = router;
