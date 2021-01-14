var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth.mdw');
const proDb = require('../models/product.model');
const likeDb = require('../models/like.model');
const buyDb = require('../models/buy.model');
var bcrypt = require('bcrypt');
var db = require('../models/user.model');
var userDb = require('../models/user.model');
const { paginate } = require('../config/default.json');
//Khởi tạo biến cấu hình cho việc lưu trữ file


router.get('/', auth.auth, function(req, res) {
    var name;
    if (req.session.authUser.Name == null) {
        name = "Unknown";
    } else {
        name = req.session.authUser.Username;
    }
    

    res.render('profile/profile', {
        name: name,
        email: req.session.authUser.Email,
        type: req.session.authUser.Type
    });
    
})

router.get('/edit', auth.auth, function (req, res) {
    res.render('profile/editPro', {
        error: null
    });
})

router.post('/edit', auth.auth, async function(req, res) {
    var user = req.session.authUser;

    var cur_psw = req.body.cur_psw;
    var name = req.body.name;
    var email = req.body.email;
    var new_psw = req.body.new_psw;
    if (!(bcrypt.compareSync(cur_psw, user.Password))) {
        res.render('profile/editPro', {
            error: 'wrong_psw'
        });
        return;
    }

    if (name != '') {
        user.Name = name;
        await db.updateName(user.Username, name);
        //res.render('profile/editPro', { title: req.session.authUser.Name, error: null });
    }

    if (email != '') {
        user.Email = email;
        await db.updateEmail(user.Username, email);
    }

    if (new_psw != '') {
        const salt = bcrypt.genSaltSync(10);
        user.Password = bcrypt.hashSync(new_psw, salt);
        await db.updatePass(user.Username, user.Password);
    }

    req.session.authUser = user;
    res.render('profile/editPro', { title: req.session.authUser, error: 'success' });
})

router.get('/edit/is-exists-email', async function(req, res) {
    const email = req.query.email;
    
    var user = await userDb.singleByEmail(email);
    if (user !== false) {
        return res.json('success');
    }
    return res.json('fail');
})

router.get('/favorite_courses', auth.auth, async function(req, res) {
    var name, auth;
    name = req.session.authUser.Username;
    auth = true;

    //current page
    var page = req.query.page || 1; 

    //find the number of page
    var list = await likeDb.listByUser(name);
    const total = 0;
    if (list != null)
        total = list.length;
    var nPages = Math.floor(total/+paginate.limit);
    
    if (total % +paginate.limit > 0) nPages++;
    
    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
        page_numbers.push({
            value: i,
            isCurrentPage: i === +page
        });
    }

    const offset = (page - 1) * paginate.limit;
    const listProduct = await likeDb.pageByFav(name, offset);

    res.render('profile/favorites', {
        auth: auth,
        name: name,
        courses: listProduct,
        curPage: +page,
        numPage: nPages,
        numCourse: total,
        error: null
    });
})

router.get('/enroll_courses', auth.auth, async function(req, res){
    var name, auth;
    name = req.session.authUser.Username;
    auth = true;

    //current page
    var page = req.query.page || 1; 

    //find the number of page
    var list = await buyDb.listByUser(name);
    const total = 0;
    if (list != null)
        total = list.length;
    var nPages = Math.floor(total/+paginate.limit);
    
    if (total % +paginate.limit > 0) nPages++;
    
    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
        page_numbers.push({
            value: i,
            isCurrentPage: i === +page
        });
    }

    const offset = (page - 1) * paginate.limit;
    const listProduct = await buyDb.pageByBought(name, offset);

    res.render('profile/myCourses', {
        auth: auth,
        name: name,
        courses: listProduct,
        curPage: +page,
        numPage: nPages,
        numCourse: total,
        error: null
    });
})

router.get('/my_courses', auth.auth, async function(req, res){
    var name, auth;
    name = req.session.authUser.Username;
    auth = true;

    //current page
    var page = req.query.page || 1; 

    //find the number of page
    var list = await proDb.getByTeacher(name);
    const total = 0;
    if (list != null)
        total = list.length;
    var nPages = Math.floor(total/+paginate.limit);
    
    if (total % +paginate.limit > 0) nPages++;
    
    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
        page_numbers.push({
            value: i,
            isCurrentPage: i === +page
        });
    }

    const offset = (page - 1) * paginate.limit;
    const listProduct = await proDb.pageByTeacherCourses(name, offset);
    console.log(listProduct);
    
    res.render('profile/myCourses', {
        auth: auth,
        name: name,
        courses: listProduct,
        curPage: +page,
        numPage: nPages,
        numCourse: total,
        error: null
    });
})

module.exports = router;