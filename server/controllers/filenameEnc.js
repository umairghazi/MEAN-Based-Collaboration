var mongoose = require('mongoose');
var FileName = mongoose.model('FileName');
var ObjectId = mongoose.Types.ObjectId;


/**
 *  Save filenames in mongo
 */
exports.create = function (req, res) {
    var fn = new FileName(req.body);
    fn.creator = req.user;
    fn.save(function (err) {
        if (err) {
            res.json(500, err);
        } else {
            res.json(fn);
        }
    });
};

exports.findFile = function (req, res, next) {

    var encodedName = req.params.file;
    FileName.findOne({modifiedName: encodedName}).exec(function(err,data) {
        next(null,data);
    });
};