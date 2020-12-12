var express = require('express');
var router = express.Router();
const db = require('../utils/db');
const bcrypt = require('bcrypt');
const { add } = require('../utils/db');

const jwtHelper = require("../utils/jwt.helper");
const debug = console.log.bind(console);
// Biến cục bộ trên server này sẽ lưu trữ tạm danh sách token
// Trong dự án thực tế, nên lưu chỗ khác, có thể lưu vào Redis hoặc DB
let tokenList = {};
// Thời gian sống của token
const accessTokenLife = "1h";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret = "access-token-secret-example-trungquandev.com-green-cat-a@";
// Thời gian sống của refreshToken
const refreshTokenLife = "3650d";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const refreshTokenSecret = "refresh-token-secret-example-trungquandev.com-green-cat-a@";

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

router.post('/login', async function(req, res, next) {
  try {
    debug(`Thực hiện lấy thông tin user...`);

    const { email, pwd } = req.body;

    var user =  await db.load("SELECT * FROM Users WHERE email = '" + req.body.email + "'");
    console.log(user[0]);
    
    if (user) { //still this to handle this
      res.redirect('/users/login');
    } else {
      user = user[0][0];
    }

    console.log(user);
    var result = bcrypt.compareSync(pwd, user.password)
    console.log(result);
    if (!result) {
      console.log(req.body.psw);
      res.redirect('/users/login');
    } else {
      debug(`Thực hiện tạo mã Token, [thời gian sống 1 giờ.]`);
      const accessToken = await jwtHelper.generateToken(user, accessTokenSecret, accessTokenLife);
      
      debug(`Thực hiện tạo mã Refresh Token, [thời gian sống 10 năm] =))`);
      const refreshToken = await jwtHelper.generateToken(user, refreshTokenSecret, refreshTokenLife);
      // Lưu lại 2 mã access & Refresh token, với key chính là cái refreshToken để đảm bảo unique và không sợ hacker sửa đổi dữ liệu truyền lên.
      // lưu ý trong dự án thực tế, nên lưu chỗ khác, có thể lưu vào Redis hoặc DB
      tokenList[refreshToken] = {accessToken, refreshToken};
        
      debug(`Gửi Token và Refresh Token về cho client...`);
      return res.status(200).json({accessToken, refreshToken});
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;