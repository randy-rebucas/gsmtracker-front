const express = require('express');

const AppointmentController = require('../controllers/appointment');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, AppointmentController.create); //extractFile,

router.get('', AppointmentController.getAll);

// router.get('/:appointmentId', AppointmentController.get);

router.delete('/:appointmentId', checkAuth, AppointmentController.delete);


module.exports = router;
