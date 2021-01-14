var express = require('express');
var router = express.Router();
const proDb = require('../models/product.model');
const likeDb = require('../models/like.model');
const buyDb = require('../models/buy.model');
const lessonDb = require('../models/lesson.model');
const learnDb = require('../models/learn.model');
const commentDb = require('../models/comment.model');
const userDb = require('../models/user.model');
const cateDb = require('../models/cate.model');
const { paginate } = require('../config/default.json');
const auth = require('../middlewares/auth.mdw');
var upload = require('../middlewares/upload.mdw');
var moment = require('moment');

router.get('/it/:id', async function(req, res) {
    var catId = req.params.id;  

    var auth, name;
    if (req.session.auth === true) {
        auth = true;
        name = req.session.authUser.Username;
    } else {
        auth = false;
        name = null;
    }

    //current page
    var page = req.query.page || 1; 

    //find the number of page
    var list = await proDb.getByCategory(catId);
    var total;
    if (list == null) {
        total = 0;
    } else {
        total = list.length;
    }

    //no course in cate
    if (total == 0) {
        res.render('courses/byCat', {
            auth: auth,
            name: name,
            empty: true,
            numCourse: 0
        })
    }
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
    const listProduct = await proDb.pageByCat(catId, offset);

    //list hot courses
    
    var hot = await proDb.relativeCourses(listProduct[0].CourseID, catId);
    var max;
    if (hot != null)
        max = (hot[0].NumberStudent > listProduct[0].NumberStudent) ? hot[0].NumberStudent : listProduct[0].NumberStudent;
    else
        max = listProduct[0].NumberStudent;

    if (max == 0)
        max = 1
    
    res.render('courses/byCat', {
        auth: auth,
        name: name,
        empty: false,
        courses: listProduct,
        numPage: nPages,
        numCourse: total,
        cate: req.params.id,
        curPage: +page,
        moment: moment,
        max: max
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
    var comment = await commentDb.newestComment(id);
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

    if (user === null) {
        return res.json('success');
    }

    return res.json('fail');
})

router.get('/remove/fav', auth.auth, async function(req, res) {
    const id = req.query.courseid;

    var result = await likeDb.remove(req.session.authUser.Username, id);
    if (result !== false) {
        res.json('success');
    } else {
        res.json('fail')
    }
})
router.get('/detail/check/is-buy', auth.auth, async function (req, res) {
    const id = req.query.courseid;
    
    const user = await buyDb.ifUserBuy(req.session.authUser.Username, id);

    if (user === null) {
        return res.json('success');
    }

    return res.json('fail');
})

router.get('/detail/check/learn', auth.auth, async function (req, res) {
    const courseid = req.query.courseid;
    const lessonid = req.query.lessonid;
    const status = req.query.status;
    const username = req.session.authUser.Username;
    

    var lesson = {Username: username, CourseID: courseid, Lesson: lessonid};


    var result;
    if (status == 'true') {
        result = await learnDb.updateLearnLesson(lesson);
        console.log("123");
    } else {
        result = await learnDb.deleteLesson(lesson);
        console.log("456");
    }

    if (result === true) {
        res.json("success");
    } else {
        res.json("fail");
    }
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

router.get('/new_course', auth.auth, async function(req, res) {
    if (req.session.authUser.Type == 'user') {
        res.redirect('/');
    }

    var teachers = null;
    if (req.session.authUser.Type == 'admin') {
        teachers = await userDb.listType('teacher');
    }

    var listCate = await cateDb.getListCateName();
    console.log(listCate);

    res.render('courses/add_course', {
        type: req.session.authUser.Type,
        teachers: teachers,
        listCate: listCate,
    });
})

router.post('/new_course', upload.upload.single('course_img'), async function(req, res, next) {
    console.log("Add a new course");

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();

    var catid = await cateDb.getId(req.body.course_cate);
    var course = {
        CourseID: null,
        Name: req.body.course_name,
        Teacher: req.session.authUser.Username,
        Description: req.body.course_description,
        DetailDescription: req.body.course_detail_description,
        Preview: 0,
        DateStart: yyyy + '-' + mm + '-' + dd,
        NumberStudent: 0,
        Status: 0,
        Category: catid,
        View: 0,
        Price: 0
    }

    //name of the teacher
    if (req.session.authUser.Type == 'admin') {
        course.Teacher = req.body.course_teacher;
    }

    var lastCourse = await proDb.lastCourse();
    if (lastCourse == null) {
        course.CourseID = 1;
    } else {
        course.CourseID = +lastCourse.CourseID + 1
    }

    //add to db
    await proDb.addCourse(course);

    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error);
    }
    res.redirect('/courses/detail/' + course.CourseID);
})

router.get('/new_lesson/:courseid', auth.auth, async function(req, res) {
    var courseid = req.params.courseid;
    var course = await proDb.singleByID(courseid);

    if (req.session.authUser.Type != 'admin') {
        if (course.Teacher != req.session.authUser.Username) {
            res.redirect('/');
        }
    }

    res.render('courses/add_lesson', {
        course: course
    });
})

router.post('/new_lesson/:courseid', async function(req,res) {
    var courseid = req.params.courseid;

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();


    var lessons = await lessonDb.getLessonByCourseID(courseid);
    var num_lesson = 0;
    if (lessons != null) {
        num_lesson = lessons.length;
    }
    var lesson = {
        CourseID: courseid,
        Lesson: num_lesson + 1,
        Name: req.body.lesson_name,
        Video: req.body.lesson_link,
        DateUpload: yyyy + '-' + mm + '-' + dd,
        Trailer: (req.body.lesson_trailer == 'Yes') ? 1 : 0
    }

    await lessonDb.addLesson(lesson);
    res.redirect('/courses/detail/' + courseid);
})

router.get('/edit', auth.auth, async function(req, res) {
    if (req.session.authUser.Type == 'user') {
        res.redirect('/');
    }

    var courses;
    if (req.session.authUser.Type == 'admin') {
        courses = await proDb.allCourse();
    } else {
        courses = await proDb.getByTeacher(req.session.authUser.Username);
    }
    
    var lessons_all = [];

    if (courses != null) {
        for (var i = 0; i < courses.length; i++) {
            var lessons = await lessonDb.getLessonByCourseID(courses[i].CourseID);
            if (lessons == null) 
                lessons_all.push([]);
            else 
                lessons_all.push(lessons);
        }
    }

    res.render('courses/edit', {
        courses: courses,
        lesson: lessons_all
    });
})

router.post('/edit_course', async function(req, res) {
    var courseid = req.body.course_choose;
    var description = req.body.course_description;
    var detail_description = req.body.course_detail_description;
    var status = (req.body.course_complete == 'on') ? 1 : 0;

    await proDb.update(courseid, status, description, detail_description);
    res.redirect("/courses/detail/"+courseid);
})

router.post('/edit_lesson', async function(req, res) {
    var courseid = req.body.lesson_course_choose;
    var lessonid = req.body.lesson_choose;
    var video = req.body.lesson_video;

    await lessonDb.update(courseid, lessonid, video);
    res.redirect("/courses/detail/"+courseid);
})

router.post('/search', async function(req, res) {
    const search_input = req.body.search_input;

    var page = 1;
    //find the number of page
    var list = await proDb.getBySearch(search_input);

    const total = list.length;
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
    const listProduct = await proDb.pageBySearch(search_input, offset);

    var auth, name;
    if (req.session.auth === true) {
        auth = true;
        name = req.session.authUser.Username;
    } else {
        auth = false;
        name = null;
    }

    res.render('courses/bySearch', {
        auth: auth,
        name: name,
        courses: listProduct,
        numPage: nPages,
        numCourse: total,
        cate: req.params.id,
        curPage: +page,
        search_input: search_input
    });
})

router.get('/search', async function(req, res){
    console.log(req.query);
    var search_input = req.query.search_input
    //current page
    var page = req.query.page; 

    //find the number of page
    var list = await proDb.getBySearch(search_input);

    const total = list.length;
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
    const listProduct = await proDb.pageBySearch(search_input, offset);

    var auth, name;
    if (req.session.auth === true) {
        auth = true;
        name = req.session.authUser.Username;
    } else {
        auth = false;
        name = null;
    }

    res.render('courses/bySearch', {
        auth: auth,
        name: name,
        courses: listProduct,
        numPage: nPages,
        numCourse: total,
        cate: req.params.id,
        curPage: +page,
        search_input: search_input
    });
})

module.exports = router;