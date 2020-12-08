var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/regis', function(req, res, next) {
  res.render('account/signup', { title: 'Regisation' });
});

router.post('/regis', function(req, res) {
  
});
module.exports = router;