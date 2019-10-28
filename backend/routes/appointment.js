const express = require('express');

const AppointmentController = require('../controllers/appointment');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, AppointmentController.create);

router.put('/:appointmentId', checkAuth, AppointmentController.update);

router.get('/new', AppointmentController.getNewAppointment);

router.get('/:appointmentId', AppointmentController.get);

router.get('', AppointmentController.getAll);

router.delete('/:appointmentId', checkAuth, AppointmentController.delete);


module.exports = router;
