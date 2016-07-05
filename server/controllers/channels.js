var mongoose = require('mongoose');
var Channel = mongoose.model('Channel');
var ObjectId = mongoose.Types.ObjectId;


/**
 * Find channel by id
 */
exports.channels = function(req, res, next, id) {
    Channel.load(id, function(err, chat) {
        if (err) return next(err);
        if (!chat) return next(new Error('Failed to load channel ' + id));
        req.chat = chat;
        next();
    });
};

/**
 * Create a channel
 */
exports.create = function(req, res) {
    var channel = new Channel(req.body);
    channel.creator = req.user;

    channel.save(function(err) {
        if (err) {
            res.json(500, err);
        } else {
            res.json(channel);
        }
    });
};

/**
 * Delete a channel
 */
exports.destroy = function(req, res) {
    var channel = req.channel;

    channel.remove(function(err) {
        if (err) {
            res.json(500, err);
        } else {
            res.json(channel);
        }
    });
};


/**
 * Show a channel name
 */
exports.showName = function(req, res) {
    Channel.findById(ObjectId(req.params.channelId),function(err,channel){
        if(err){
            return next(new Error('Failed to load user'));
        }
        if(channel){
            res.send(channel.name);
        }else{
            res.send(404, 'Channel Not Found');
        }
    })
    // res.json(req.channel);
};

/**
 * List of Channels
 */
exports.all = function(req, res) {
    Channel.find().sort('-created').populate('creator', 'username').exec(function(err, chats) {
        if (err) {
            res.json(500, err);
        } else {
            res.json(chats);
        }
    });
};
