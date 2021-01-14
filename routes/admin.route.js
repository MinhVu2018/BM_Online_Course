var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth.mdw');
var bcrypt = require('bcrypt');
var fs = require('fs');

//require database
const cateDb = require('../models/cate.model');
const proDb = require('../models/product.model');
const userDb = require('../models/user.model');
const buyDb = require('../models/buy.model');
const likeDb = require('../models/like.model');
const lessonDb = require('../models/lesson.model');
const learnDb = require('../models/learn.model');
var upload = require('../middlewares/upload.mdw');

const db = require('../utils/db');

router.get('/', auth.authAdmin, async function(req, res) {
    const users = await userDb.allUser();
    const courses = await proDb.allCourse();
    const cate = await cateDb.allCate();

    res.render(('admin/admin'), {
        users: users,
        courses: courses,
        category: cate
    });
})

router.post('/del_course', auth.authAdmin, async function(req, res) {
    var course = req.body.del_courseid;

    await proDb.deleteByID(course);
    await likeDb.deleteByID(course);
    await lessonDb.deleteByID(course);
    await proDb.deleteByID(course);
    await learnDb.deleteByID(course);

    fs.unlinkSync('./public/images/courses/' + course + '.jpg');
    res.redirect('back');
})

router.post('/del_user', auth.authAdmin, async function(req, res) {
    const username = req.body.del_username;

    var result = await userDb.deleteUser(username);
    await buyDb.deleteByUser(username);
    await likeDb.deleteByUser(username);
    await learnDb.deleteByUser(username);
    
    //delete courses if user own courses
    //do here

    res.redirect('back');
})

router.post('/add_user', auth.authAdmin, async function(req, res) {
    var user = {
        Username: req.body.add_username,
        Name: null,
        Password: bcrypt.hashSync(req.body.add_password, bcrypt.genSaltSync(10)),
        Email: req.body.add_email,
        Type: req.body.add_type.toLowerCase()
    }

    var result = await userDb.add(user);
    console.log(result);
    res.redirect('back');
})

router.post('/edit_user', auth.authAdmin, async function(req, res) {
    var username = req.body.edit_username;

    var name = req.body.edit_fullname;
    var email = req.body.edit_email;
    var type = req.body.edit_type.toLowerCase();

    await userDb.updateType(username, type);
    if (name != '') {
        await userDb.updateName(username, name);
    }
    if (email != '') {
        await userDb.updateEmail(username, email);
    }

    
    res.redirect('back');
})

//cate
router.post('/add_cate', auth.authAdmin, upload.upload_cate.single('cate_img'), async function(req, res, next) {
    var id = 1;
    var getid = await cateDb.lastCate();
    
    if (getid != null)
        id = +getid.CatId + 1;

    var cate = {
        CatId: +id,
        CatName: req.body.add_catename,
    }

    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error);
    }

    var result = await cateDb.add(cate);
    res.redirect('back');
})

router.post('/edit_cate', auth.authAdmin, upload.upload_cate.single('cate_img'), async function(req, res) {
    var catid = req.body.edit_cateid;
    var catname = req.body.edit_catename;

    if (catname != '') {
        await cateDb.updateName(catid, catname);
    }
    res.redirect('back');
})

router.post('/del_cate', auth.authAdmin, async function(req, res) {
    const catename = req.body.del_catename;

    var id = await cateDb.getId(catename);
    fs.unlinkSync('./public/images/cate/' + id + '.jpg');

    var result = await cateDb.deleteCate(catename);
    
    res.redirect('back');
})

//check for js
router.get('/user-exists', async function(req, res) {
    var user = await userDb.singleByUserName(req.query.username);
    if (user != null) {
        res.json('success');
    } else {
        res.json('fail');
    }
})

router.get('/email-exists', async function(req, res) {
    var user = await userDb.singleByEmail(req.query.email);
    if (user != null) {
        res.json('success');
    } else {
        res.json('fail');
    }
})

router.get('/course-exists', async function(req, res) {
    var course = await proDb.singleByID(req.query.course);
    if (course != null) {
        res.json('success');
    } else {
        res.json('fail');
    }
})

router.get('/cate-exists', async function(req, res) {
    var cate = await cateDb.singleByCateName(req.query.catename);
    if (cate != null) {
        res.json('success');
    } 
    else {
        res.json('fail');
    }
})

router.get('/cateid-exists', async function(req, res) {
    var cate = await cateDb.singleByCateId(req.query.cateid);
    if (cate != null) {
        res.json('success');
    } 
    else {
        res.json('fail');
    }
})

router.get('/cate-num-courses', async function(req, res) {
    var cate = await cateDb.checkCateNumCourse(req.query.catename);
    if (cate.numCourses == 0) {
        res.json('available');
    } 
    else {
        res.json('unavailable');
    }
})

// category
router.get('/new_category', async function(req, res){
    if (req.session.authUser.Type == 'user' || req.session.authUser.Type == 'teacher') {
        res.redirect('/');
    }

    res.render('admin/add_cat', {
        type: req.session.authUser.Type,
    });
})

module.exports = router;
