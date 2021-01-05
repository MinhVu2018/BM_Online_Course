var express = require('express');
var router = express.Router();
const proDb = require('../models/product.model');
const likeDb = require('../models/like.model');
const buyDb = require('../models/buy.model');
const lessonDb = require('../models/lesson.model');
const learnDb = require('../models/learn.model');
const commentDb = require('../models/comment.model');
const { paginate } = require('../config/default.json');
const auth = require('../middlewares/auth.mdw');
var upload = require('../middlewares/upload.mdw');
var moment = require('moment');

router.get('/it/web/page/:id', async function(req, res) {
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

router.post('/detail/comment/:id', async function(req, res) {
    var comment = req.body.comment;
    var point = req.body.point;
    var courseid = req.params.id;
    var username = req.session.authUser.Username;

    //current date
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();

    var com = {
        Username: username,
        CourseID: courseid,
        Comment: comment,
        Point: +point,
        Date: yyyy + '-' + mm + '-' + dd
    }

    //update score point of course
    var course = await proDb.singleByID(courseid);
    var sum_point = course.Preview * course.NumPreview;
    var new_numPreview = course.NumPreview + 1;
    var new_point = (sum_point + (+point)) / new_numPreview;
    await proDb.updatePreview(courseid, new_point, new_numPreview);

    await commentDb.addComment(com);
    res.redirect('back');
})

router.get('/detail/:id', async function(req, res){
    var id = req.params.id;
    
    //increase view
    var numView = await proDb.numView(id);
    console.log(numView);
    numView = numView.View + 1;

    var auth, name;
    if (req.session.auth === true) {
        auth = true;
        name = req.session.authUser.Username;
    } else {
        auth = false;
        name = null;
    }
    
    //update view
    await proDb.updateView(id, numView);
    var lesson = await lessonDb.getLessonByCourseID(+id);
    var course = await proDb.singleByID(+id);

    //find the relative courses
    var relative = await proDb.relativeCourses(id, course.Category);

    //list lesson user have learn
    if (name != null) 
        var learned = await learnDb.getLessonLearned(name, +id);
    else
        var learned = null;
    
    //list comment 
    var comment = await commentDb.newestComment();

    console.log(learned);
    res.render('courses/detail', {
        auth: auth,
        name: name,
        course: course,
        lesson: lesson,
        relative: relative,
        learn: learned,
        comment: comment,
        moment: moment
    });
})

router.get('/detail/check/is-comment', auth.auth, async function(req, res) {
    var courseid = req.query.courseid;
    var username = req.session.authUser.Username;

    var result = await commentDb.checkExist(courseid, username);
    if (result === null) {
        return res.json('success');
    } else {
        return res.json('fail');
    }
})
router.get('/detail/check/is-like', auth.auth, async function (req, res) {
    const id = req.query.courseid;

    const user = await likeDb.ifUserLike(req.session.authUser.Username, id);
    //console.log(user);
    if (user === null) {
      return res.json('success');
    }
  
    return res.json('fail');
  })

  router.get('/detail/check/is-buy', auth.auth, async function (req, res) {
    const id = req.query.courseid;
    
    const user = await buyDb.ifUserBuy(req.session.authUser.Username, id);

    if (user === null) {
      return res.json('success');
    }
  
    return res.json('fail');
  })

router.get('/course/:id/like', auth.auth, async function(req, res){
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

router.get('/course/:id/buy', auth.auth, async function(req, res){
    var id = req.params.id;

    var listBuy = await buyDb.listByUser(req.session.authUser.Username);
    if (listBuy != null) {
        for (var i = 0; i < listBuy.length; i++) {
            if (+listBuy[i].CourseID == +id) {
                res.redirect('back');
                return;
            }
        }
    }
    
    var numUser = await proDb.numStudent(id);
    numUser = numUser.NumberStudent + 1;

    await proDb.updateStudent(numUser, id)
    await buyDb.add(req.session.authUser.Username, id);
    res.redirect('back');
})

router.get('/new_course', auth.authTeacher, function(req, res) {
    res.render('courses/add_course');
})

router.post('/new_course', upload.single('course_img'), async function(req, res, next) {
    console.log("Add a new course");

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();

    console.log(req.body);
    var course = {
        CourseID: await proDb.numberCourse() + 1,
        Name: req.body.course_name,
        Teacher: req.session.authUser.Username,
        Description: req.body.course_description,
        DetailDescription: req.body.course_detail_description,
        Preview: 0,
        DateStart: yyyy + '-' + mm + '-' + dd,
        NumberStudent: 0,
        Status: 0,
        Category: req.body.course_cate == 'web' ? 1 : 2,
        View: 0,
        Price: 0
    }

    await proDb.addCourse(course);
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error);
    }
    res.send(file);
})



router.get('/learning/:courseid/:lessonid', auth.auth, async function(req, res) {
    var lessonid = req.params.lessonid;
    var courseid = req.params.courseid;

    var lesson = await lessonDb.singeLessonByID(+courseid, +lessonid);

    //update user learned lesson
    var learn = {
        Username: req.session.authUser.Username,
        CourseID: +courseid,
        Lesson: +lessonid
    }

    var temp = await learnDb.checkExist(learn);
    if (temp == null)
        await learnDb.updateLearnLesson(learn);

    res.render('courses/lesson', {
        lesson: lesson
    });
})


module.exports = router;