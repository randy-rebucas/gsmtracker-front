const express = require('express');

const Controller = require('../../controllers/records/height');

const checkAuth = require('../../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, Controller.create);

router.put('/:heightId', checkAuth, Controller.update);

router.get('', Controller.getAll);

router.get('/latest/:patientId', Controller.getCurrent);

router.get('/last/:patientId', Controller.getLast);

router.get('/:heightId', Controller.get);

router.delete('/:heightId', checkAuth, Controller.delete);


module.exports = router;
