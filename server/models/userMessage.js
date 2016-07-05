
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserMsgSchema = new Schema({

    FromUserId: String,
    ToUserId: String,
    Message: {
        body: String,
        timestamp: Date,
        // uid : String,
        // username : String
    }
});

UserMsgSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).populate('creator', 'username').exec(cb);
    }
};

mongoose.model('UserMsg', UserMsgSchema);
