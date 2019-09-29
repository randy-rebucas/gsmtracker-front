const express = require('express');

const Controller = require('../../controllers/records/allergy');

const checkAuth = require('../../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, Controller.create);

router.put('/:allergyId', checkAuth, Controller.update);

router.get('', Controller.getAll);

router.get('/latest/:patientId', Controller.getCurrent);

router.get('/last/:patientId', Controller.getLast);

router.get('/:allergyId', Controller.get);

router.delete('/:allergyId', checkAuth, Controller.delete);


module.exports = router;
