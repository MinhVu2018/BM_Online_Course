//const auth = require('./auth.mdw');

module.exports = function (app) {
    app.use('/', require('../routes/index.route'));
    app.use('/users', require('../routes/account.route'));
    app.use('/courses', require('../routes/product.route'));
    
    app.use(function (req, res) {
    res.render('error', {
      error: "404 not found"
    });
  });
}