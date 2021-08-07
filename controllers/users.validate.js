module.exports.postcreate = function(req, res, next) {
    var errors = [];
    if(!req.body.name){
        errors.push('Name is required');
    }
    if(!req.body.phone){
        errors.push("Phone is required");
    }

    if(errors.length){
        res.render('users/create',{
            errors: errors,
            values: req.body
        });
        return;
    }
    res.locals.success = true;
    res.locals.cancel = false;
    next()
};