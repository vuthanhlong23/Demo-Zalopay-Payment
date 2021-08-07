var db = require('../db');
//shorid 
var shortid = require('shortid');

module.exports.index = function(req, res) {
    res.render('users/search', {
      userslist: db.get('userslist').value()
    });
};

module.exports.search = function(req, res) {
    var q = req.query.q;
    var matchedusers = db.get('userslist').value().filter(function(user){
        return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    })
    res.render('/search',{
        userslist: matchedusers,
        question: q
    })
};

module.exports.create = function(req, res) {
    res.render('users/create');
    console.log(req.cookies)
};

module.exports.get = function(req, res){
    var id = req.params.id;
    var user = db.get('userslist').find({id: id}).value();
    res.render('users/view',{
        user: user
    });
};

module.exports.postcreate = function(req, res) {
    req.body.id = shortid.generate()
    db.get('userslist').push(req.body).write();

    console.log(res.locals.success)

    res.redirect('/users')
};

