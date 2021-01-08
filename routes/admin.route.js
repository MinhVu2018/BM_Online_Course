var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth.mdw');

//require database
const cateDb = require('../models/cate.model');
const proDb = require('../models/product.model');
const userDb = require('../models/user.model');


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
module.exports = router;
