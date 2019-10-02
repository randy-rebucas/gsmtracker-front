const express = require('express');

const Controller = require('../../controllers/records/endorsement');

const checkAuth = require('../../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, Controller.create);

router.put('/:endorsementId', checkAuth, Controller.update);

router.get('', Controller.getAll);

router.get('/latest', Controller.getCurrent);

router.get('/last/:patientId', Controller.getLast);

router.get('/:endorsementId', Controller.get);

router.delete('/:endorsementId', checkAuth, Controller.delete);


module.exports = router;
