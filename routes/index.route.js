var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.auth === true) {
    res.render('index', { 
      auth: true,
      name: req.session.authUser.userName
    });
    return;
  }

  res.render('index', {
    auth: false,
    name: null
  })
});

module.exports = router;