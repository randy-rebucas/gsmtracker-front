const express = require('express');

const Controller = require('../../controllers/records/weight');

const checkAuth = require('../../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, Controller.create);

router.put('/:weightId', checkAuth, Controller.update);

router.get('', Controller.getAll);

router.get('/last/:patientId', Controller.getLast);

router.get('/latest/:patientId', Controller.getCurrent);

router.get('/:weightId', Controller.get);

router.delete('/:weightId', checkAuth, Controller.delete);

module.exports = router;
