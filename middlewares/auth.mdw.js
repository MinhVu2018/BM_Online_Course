module.exports = { 
    auth: function (req, res, next) {
      if (req.session.auth === false) {
        req.session.retUrl = req.originalUrl;
        return res.redirect('/authen/login');
      }
      next();
    },
  

    isNotAuth :function(req, res, next) {
      if (req.session.auth === true) {
        return res.redirect('/');
      }
      next();
    },

    authTeacher: function(req, res, next) {
      if (req.session.auth === true) {
        if (req.session.authUser.Type == 'teacher') {
          return next();
        }
      }
      return res.redirect('/');
    },

    authAdmin: function(req, res, next) {
      if (req.session.auth === true) {
        if (req.session.authUser.Type == 'admin') {
          return next();
        }
      }
    }
};