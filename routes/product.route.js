var express = require('express');
var router = express.Router();
const db = require('../models/product.model');
const { paginate } = require('../config/default.json');

router.get('/web/page/:id', async function(req, res) {
    const catId = +req.params.id;
    const web = 1;

    //current page
    var page = req.query.page || 1; 
    if (page < 1) page = 1; 

    //find the number of page
    var list = db.sortCategory(web);
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
    const listProduct = await db.pageByCat(catId, offset);
    
    res.render('courses/byCat', {
        products: listProduct,
        page_numbers,
    });
});

// router.get('/',function(req, res){
//     res.render('courses/all_courses');
// });

module.exports = router;