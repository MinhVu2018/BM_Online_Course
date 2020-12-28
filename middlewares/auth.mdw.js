module.exports = { 
    auth: function (req, res, next) {
      if (req.session.auth === false) {
        req.session.retUrl = req.originalUrl;
        return res.redirect('/users/login');
      }
      next();
    },
  

    isNotAuth :function(req, res, next) {
      if (req.session.auth === true) {
        return res.redirect('/');
      }
      next();
    }
};