var express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer");
const config = require("../config/default.json").gmail;
const db = require('../models/user.model');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth.mdw');

var user;
var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
      user: config.user,
      pass: config.pass
  }
});
var rand,mailOptions,host,link;

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

  user = {
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
  
  rand=Math.floor((Math.random() * 100) + 54);
  host=req.get('host');
  link="http://"+req.get('host')+"/authen/verify?id="+rand;
  mailOptions={
    to : user.email,
    subject : "Please confirm your Email account",
    html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
  }

  smtpTransport.sendMail(mailOptions, function(error, response) {
    if(error){
      console.log(error);
      res.end("error");
    } else {
      console.log("Message sent: " + response.message);
      res.end("sent");
    }

  });
  res.render('account/noti', {
    status: "Welcome to Online Courses",
    message: "Một mail xác thực đã được gửi đến tài khoản email của bạn! Vui lòng kiểm tra hộp thư để có thể sử dụng dịch vụ của chúng tôi."
  });
});

router.get('/verify', async function(req,res) {
  console.log(req.protocol+":/"+req.get('host'));
  if((req.protocol+"://"+req.get('host'))==("http://"+host))
  {
      console.log("Domain is matched. Information is from Authentic email");
      if(req.query.id==rand)
      {
          console.log("email is verified");
          const result = await db.add(user, 'Users');
          res.end("<h1>Email "+ mailOptions.to +" is been Successfully verified");
      }
      else
      {
          console.log("email is not verified");
          res.end("<h1>Bad Request</h1>");
      }
  }
  else {
      res.end("<h1>Request is from unknown source");
  }
});

router.get('/login', auth.isNotAuth, function(req, res, next) {
  res.render('account/login', {
    msg: 0
  });
});

router.post('/login', auth.isNotAuth, async function(req, res, next) {
  const email = req.body.email;
  const password = req.body.psw;

  const user = await db.singleByEmail(email);
  if (user == null) {
    res.render('account/login', {
      msg: 'email'
    });
    return;
  }

  console.log(user);
  if (!(bcrypt.compareSync(password, user.Password))) {
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
