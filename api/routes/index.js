var express = require('express');
var router = express.Router();

// Project routes
var template = require('../controllers/template.js');
router.post('/api/v1/template/new', template.create);
router.get('/api/v1/template/', template.read);
router.get('/api/v1/template/:projectId', template.read);
router.put('/api/v1/template/:projectId', template.update);
router.delete('/api/v1/template/:projectId', template.delete);

module.exports = router;
