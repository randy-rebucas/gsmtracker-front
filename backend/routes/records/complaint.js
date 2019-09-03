const express = require('express');

const Controller = require('../../controllers/records/complaint');

const checkAuth = require('../../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, Controller.create);

router.put('/:complaintId', checkAuth, Controller.update);

router.get('', Controller.getAll);

router.get('/latest', Controller.getCurrent);

router.get('/last/:patientId', Controller.getLast);

router.get('/:complaintId', Controller.get);

router.delete('/:complaintId', checkAuth, Controller.delete);


module.exports = router;