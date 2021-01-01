var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth.mdw');

router.get('/', auth.auth, function(req, res) {
    
})
module.exports = router;