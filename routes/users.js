var express = require('express');
var router = express.Router();
const db = require('../utils/db');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/regis', function(req, res, next) {
  res.render('account/signup', { title: 'Regisation' });
});

router.post('/regis', function(req, res, next) {
  var user = {
    "userName": req.body.name,
    "password": req.body.psw,
    "email": req.body.email,
    "type": "User"
  }

  const rePass = req.body.re_psw;
  console.log(user)
  if (user.password.localeCompare(rePass) != 0) {
    res.send("Your password is not the same!");
  }

  db.add(user, 'Users')
});

module.exports = router;