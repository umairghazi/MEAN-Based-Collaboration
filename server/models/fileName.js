
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fileNameSchema = new Schema({

    originalName: String,
    modifiedName: String

});

fileNameSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).populate('creator', 'username').exec(cb);
    }
};

mongoose.model('FileName', fileNameSchema);
