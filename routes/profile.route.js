var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth.mdw');
var bcrypt = require('bcrypt');
var db = require('../models/user.model')
router.get('/', auth.auth, function(req, res) {
    var name;
    if (req.session.authUser.Name == null) {
        name = "Unknown";
    } else {
        name = req.session.authUser.Name;
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

    
    console.log(name, email, new_psw);
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

module.exports = router;