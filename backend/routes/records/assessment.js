const express = require('express');

const Controller = require('../../controllers/records/assessment');

const checkAuth = require('../../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, Controller.create);

router.put('/:assessmentId', checkAuth, Controller.update);

router.get('', Controller.getAll);

router.get('/latest', Controller.getCurrent);

router.get('/last/:patientId', Controller.getLast);

router.get('/:assessmentId', Controller.get);

router.delete('/:assessmentId', checkAuth, Controller.delete);


module.exports = router;
