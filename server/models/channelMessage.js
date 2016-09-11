
var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var Schema = mongoose.Schema;

var ChannelMsgSchema = new Schema({

    ChannelId: String,
    Message: {
        body: String,
        timestamp: Date,
        uid : String,
        username : String,
        encodedname: String,
    },
});

ChannelMsgSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).populate('creator', 'username').exec(cb);
    }
};

ChannelMsgSchema.plugin(mongoosastic);

mongoose.model('ChannelMsg', ChannelMsgSchema);

