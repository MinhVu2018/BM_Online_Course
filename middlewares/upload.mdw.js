var multer = require('multer');
var proDb = require('../models/product.model');

var diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
      // Định nghĩa nơi file upload sẽ được lưu lại
      callback(null, "/home/binh3920/khtn_courses/ptudw/BM-Online-Courses/public/images/courses/");
    },
    filename: async function (req, file, callback) {
        var num = await proDb.numberCourse() + 1;
        callback(null, `${num}.jpg`);
    }
});
var upload = multer({ storage: diskStorage });

module.exports = upload;