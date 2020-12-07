var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET regis page */
router.get('/regis', function(req, res, next) {
  res.render('register', { title: 'Registeration'});
});

module.exports = router;