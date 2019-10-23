const express = require('express');

const Controller = require('../controllers/plan');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('', Controller.create); //checkAuth,

router.put('/:planId', checkAuth, Controller.update);

router.get('', Controller.getAll);

router.get('/:planId', Controller.get);

router.get('/find/:slug', Controller.getfilter);

router.delete('/:planId', checkAuth, Controller.delete);

module.exports = router;
