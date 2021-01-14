var express = require('express');
var router = express.Router();
var db = require('../models/product.model');

/* GET home page. */
router.get('/', async function(req, res, next) {
  var topCourses = await db.sortHighlight();
  var topNewest = await db.sortByDate();
  var topView = await db.sortByView();
  var topCategory = await db.sortCategory();

  if (req.session.auth === true) {
    res.render('index', { 
      auth: true,
      name: req.session.authUser.Username,
      topCourses: topCourses,
      topNewest: topNewest,
      topView: topView,
      topCategory: topCategory
    });
  } else {
    res.render('index', {
      auth: false,
      name: null,
      topCourses: topCourses,
      topNewest: topNewest,
      topView: topView,
      topCategory: topCategory
    })
  }
  
});

module.exports = router;