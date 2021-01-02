var express = require('express');
var router = express.Router();
const proDb = require('../models/product.model');
const likeDb = require('../models/like.model');
const buyDb = require('../models/buy.model');
const { paginate } = require('../config/default.json');
const { auth } = require('../middlewares/auth.mdw');

router.get('/web/page/:id', async function(req, res) {
    const catId = +req.params.id;
    const web = 1;

    //current page
    var page = req.query.page || 1; 
    if (page < 1) page = 1; 

    //find the number of page
    var list = proDb.sortCategory(web);
    const total = list.length;
    const nPages = Math.floor(total/paginate.limit);
    if (total % paginate.limit > 0) nPages++;

    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
        page_numbers.push({
            value: i,
            isCurrentPage: i === +page
        });
    }

    const offset = (page - 1) * paginate.limit;
    const listProduct = await proDb.pageByCat(catId, offset);
    
    var auth, name;
    if (req.session.auth === true) {
        auth = true;
        name = req.session.authUser.Username;
    } else {
        auth = false;
        name = null;
    }

    res.render('courses/byCat', {
        auth: auth,
        name: name,
        products: listProduct,
        page_numbers,
    });
})

router.get('/detail/:cate/:id', async function(req, res){
    var id = req.params.id;

    var auth, name;
    if (req.session.auth === true) {
        auth = true;
        name = req.session.authUser.Username;
    } else {
        auth = false;
        name = null;
    }

    var course = await proDb.singleByID(+id);
    res.render('courses/detail', {
        auth: auth,
        name: name,
        course: course
    });
})

router.get('/detail/is-like', auth, async function (req, res) {
    const id = req.query.courseid;
    
    if (req.session.authUser.Type != 'user') {
        console.log(req.session.authUser.Type);
        return res.json('error');
    }   

    const user = await likeDb.ifUserLike(req.session.authUser.Username, id);
    //console.log(user);
    if (user === null) {
      return res.json('success');
    }
  
    return res.json('fail');
  })

  router.get('/detail/is-buy', auth, async function (req, res) {
    const id = req.query.courseid;
    
    if (req.session.authUser.Type != 'user') {
        return res.json('error');
    }

    const user = await buyDb.ifUserBuy(req.session.authUser.Username, id);

    if (user === null) {
      return res.json('success');
    }
  
    return res.json('fail');
  })

router.get('/course/:id/like', auth, async function(req, res){
    var id = req.params.id;

    var listLike = await likeDb.listByUser(req.session.authUser.Username);
    if (listLike != null) {
        for (var i = 0; i < listLike.length; i++) {
            if (+listLike[i].CourseID == +id) {
                res.redirect('back');
                return;
            }
        }
    }

    await likeDb.add(req.session.authUser.Username, id);
    res.redirect('back');
})

router.get('/course/:id/buy', auth, async function(req, res){
    var id = req.params.id;

    var listLike = await likeDb.listByUser(req.session.authUser.Username);
    if (listLike != null) {
        for (var i = 0; i < listLike.length; i++) {
            if (+listLike[i].CourseID == +id) {
                res.redirect('back');
                return;
            }
        }
    }

    await buyDb.add(req.session.authUser.Username, id);
    res.redirect('back');
})
module.exports = router;