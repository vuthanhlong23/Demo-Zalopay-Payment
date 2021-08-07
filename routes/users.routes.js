var express = require('express');
var router = express.Router();
var db = require('../db');

var controller = require('../controllers/users.controller');
var validate = require('../controllers/users.validate');
var authMiddleware = require('../middlewares/auth.middleware');

router.get('/', controller.index);
  
router.get('/search', controller.search);

router.get('/post', controller.create);

router.get('/:id', controller.get);

router.post('/post', validate.postcreate, controller.postcreate);

module.exports = router;
