'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');
/**
 * Session
 * returns info on authenticated user
 */
exports.session = function (req, res) {
    res.json(req.user.user_info);
};

/**
 * Logout
 * returns nothing
 */
exports.logout = function (req, res) {
    if (req.user) {
        var query = req.user.email;
        User.findOneAndUpdate(query,{online:false},{upsert:true},function(err,doc){
            if(err) {
                console.log(err);
            }
        });
        req.logout();
        res.send(200);
    } else {
        res.send(400, "Not logged in");
    }
};

/**
 *  Login
 *  requires: {email, password}
 */
exports.login = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        var error = err || info;
        if (error) {
            return res.json(400, error);
        }
        var query = {'email': req.body.email};
        User.findOneAndUpdate(query,{online:true},{upsert:true},function(err,doc){
           if(err) {
               console.log(eror);
           }
        });
        req.logIn(user, function (err) {
            if (err) {
                return res.send(err);
            }
            res.json(req.user.user_info);
        });
    })(req, res, next);
}
