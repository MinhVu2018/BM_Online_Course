var express = require('express');
var router = express.Router();
const db = require('../utils/db');
const bcrypt = require('bcrypt');
const { add } = require('../utils/db');

/* GET users listing. */
router.get('/regis', function(req, res, next) {
  res.render('account/signup');
});

router.post('/regis', async function(req, res, next) {
  var user = {
    "userName": req.body.name,
    "password": req.body.psw,
    "email": req.body.email,
    "type": "user"
  }

  const rePass = req.body.re_psw;

  if (user.userName.length > 10) {
    res.render('account/noti', {
      status: "Oppps",
      message: "Your user name is too long"
    })
    return;
  }
  console.log(user, rePass)
  if (!(user.password === rePass)) {
    res.render('account/noti', {
      status: "Oppps",
      message: "Your repeat password is not correct"
    })
    return;
  }

  user.password = bcrypt.hashSync(user.password, 10);
  db.add(user, 'Users');
  res.render('account/noti', {
    status: "Congratulation",
    message: "Your account has been regis success."
  })
});

router.get('/login', function(req, res, next) {
  res.render('account/login');
});

router.post('/login', function(rq, res, next) {

});
module.exports = router;