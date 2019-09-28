const express = require('express');

const Controller = require('../../controllers/records/family_history');

const checkAuth = require('../../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, Controller.create);

router.put('/:familyHistoryId', checkAuth, Controller.update);

router.get('', Controller.getAll);

router.get('/latest', Controller.getCurrent);

router.get('/last/:patientId', Controller.getLast);

router.get('/:familyHistoryId', Controller.get);

router.delete('/:familyHistoryId', checkAuth, Controller.delete);


module.exports = router;
