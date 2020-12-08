var express = require('express');
var router = express.Router();
const db = require('../public/javascripts/db');

/* GET users listing. */
router.get('/regis', function(req, res, next) {
  res.render('account/signup', { title: 'Regisation' });
});

router.post('/regis', async function(req, res) {
  var user = {
    "userName": req.body.name,
    "password": req.body.psw,
    "email": req.body.email,
    "type": "User"
  }

  console.log(user);
  db.add(user, 'Users')
});

module.exports = router;