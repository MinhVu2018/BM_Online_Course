var multer = require('multer');
var proDb = require('../models/product.model');
const cateDb = require('../models/cate.model');

var diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
      // Định nghĩa nơi file upload sẽ được lưu lại
      callback(null, "./public/images/courses/");
    },
    filename: async function (req, file, callback) {
      var num;
      var lastCourse = await proDb.lastCourse();
      if (lastCourse == null) {
          num = 1;
      } else {
          num = +lastCourse.CourseID + 1
      }
        callback(null, `${num}.jpg`);
    }
});

var diskStorageCate = multer.diskStorage({
  destination: (req, file, callback) => {
    // Định nghĩa nơi file upload sẽ được lưu lại
    callback(null, "./public/images/cate/");
  },
  filename: async function (req, file, callback) {
    var id = 1;
    var getid = await cateDb.lastCate();
    if (getid != null)
      id = +getid.CatId + 1;

    console.log(id);

    callback(null, `${id}.jpg`);
  }
});

var upload = multer({ storage: diskStorage });
var upload_cate = multer({ storage: diskStorageCate});
module.exports = { upload, upload_cate };