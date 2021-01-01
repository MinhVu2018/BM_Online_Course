var express = require('express');
var path = require('path');
var ejs = require('ejs');
var logger = require('morgan');
const bodyParser = require('body-parser');

var app = express();

// view engine setup

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false })); 

require('./middlewares/view.mdw')(app);
require('./middlewares/session.mdw')(app);
require('./middlewares/local.mdw')(app);
require('./middlewares/route.mdw')(app);




//error handle
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.render('error', {
    error: "Internal error"
  })
})


//open port
const PORT = 3000;
app.listen(PORT, function () {
  console.log(`E-Commerce app is listening at http://localhost:${PORT}`)
})
