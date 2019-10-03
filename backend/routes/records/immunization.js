const express = require('express');

const Controller = require('../../controllers/records/immunization');

const checkAuth = require('../../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, Controller.create);

router.put('/:immunizationId', checkAuth, Controller.update);

router.get('', Controller.getAll);

router.get('/latest/:patientId', Controller.getCurrent);

router.get('/last/:patientId', Controller.getLast);

router.get('/:immunizationId', Controller.get);

router.delete('/:immunizationId', checkAuth, Controller.delete);


module.exports = router;