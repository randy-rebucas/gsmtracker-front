const express = require('express');

const Controller = require('../../controllers/records/social');

const checkAuth = require('../../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, Controller.create);

router.put('/:socialId', checkAuth, Controller.update);

router.get('', Controller.getAll);

router.get('/latest', Controller.getCurrent);

router.get('/last/:patientId', Controller.getLast);

router.get('/:socialId', Controller.get);

router.delete('/:socialId', checkAuth, Controller.delete);


module.exports = router;
