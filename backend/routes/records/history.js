const express = require('express');

const Controller = require('../../controllers/records/histories');

const checkAuth = require('../../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, Controller.create);

router.put('/:historyId', checkAuth, Controller.update);

router.get('', Controller.getAll);

router.get('/latest/:patientId', Controller.getCurrent);

router.get('/last/:patientId', Controller.getLast);

router.get('/:historyId', Controller.get);

router.delete('/:historyId', checkAuth, Controller.delete);


module.exports = router;
