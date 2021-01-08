const auth = require('./auth.mdw');

module.exports = function (app) {
    app.use('/', require('../routes/index.route'));
    app.use('/authen', require('../routes/authentication.route'));
    app.use('/courses', require('../routes/product.route'));
    app.use('/profile', require('../routes/profile.route'));
    app.use('/manage', require('../routes/admin.route'));

    app.use(function (req, res) {
    res.render('error', {
      error: "404 not found"
    });
  });
}