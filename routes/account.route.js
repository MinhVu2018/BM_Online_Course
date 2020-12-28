var express = require('express');
var router = express.Router();
const db = require('../models/user.model')
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth.mdw')

/* GET users listing. */
router.get('/regis', function(req, res, next) {
  res.render('account/signup', {
    msg: 0
  });
});

router.post('/regis', async function(req, res, next) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.psw, salt);
  const rehash = bcrypt.hashSync(req.body.re_psw, salt);

  var user = {
    "userName": req.body.name,
    "password": hash,
    "email": req.body.email,
    "type": "user"
  }


  if (hash != rehash) {
    res.render('account/signup', {
      msg: 'psw'
    })
    return;
  }

  const userEmail = await db.singleByEmail(user.email);
  if (userEmail != null) {
    res.render('account/signup', {
      msg: 'email'
    })
    return;
  }
  const userByName = await db.singleByUserName(user.userName);
  if (userByName != null) { //still this to handle this
    res.render('account/signup', {
      msg: 'user'
    })
    return;
  }
  
  const result = await db.add(user, 'Users');
  res.render('account/noti', {
    status: "Complete Registration",
    message: "Please sign in to continue!"
  })
});

router.get('/login', auth.isNotAuth, function(req, res, next) {
  res.render('account/login', {
    msg: 0
  });
});

router.post('/login', async function(req, res, next) {
  const email = req.body.email
  const password = req.body.pwd;

  const user = await db.singleByEmail(email);
  if (user == null) {
    res.render('account/login', {
      msg: 'email'
    });
    return;
  }


  if (!(bcrypt.compareSync(password, user.password))) {
    res.render('account/login', {
      msg: 'psw'
    });
    return;
  }

  req.session.auth = true;
  req.session.authUser = user;

  const url = req.session.retUrl || '/';
  res.render('account/noti', {
    status: "Đăng nhập thành công",
    message: "Chào mừng bạn đến với Onlince Courses!"
  })
  
});

router.get('/logout', async function (req, res) {
  req.session.auth = false;
  req.session.authUser = null;
  req.session.retUrl = null;
  //req.session.cart = [];

  const url = req.headers.referer || '/';
  res.redirect('/')
});

module.exports = router;
