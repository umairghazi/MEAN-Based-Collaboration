var mongoose = require('mongoose');
var UserMsg = mongoose.model('UserMsg');
var User = mongoose.model('User');
var ObjectId = mongoose.Types.ObjectId;

exports.messages = function (req, res, next, id) {
    UserMsg.load(id, function (err, chat) {
        if (err) return next(err);
        if (!chat) return next(new Error('Failed to load user messages ' + id));
        req.chat = chat;
        next();
    });
};


/**
 * Create a user message
 */
exports.create = function (req, res) {
    var userMsg = new UserMsg(req.body);
    userMsg.FromUserId        = req.body.fromUserId;
    userMsg.ToUserId          = req.body.toUserId;
    userMsg.Message.body      = req.body.body;
    userMsg.Message.timestamp = Date.now();

    userMsg.save(function (err) {
        // if (err) {
        //     res.json(500, err);
        // } else {
        //     ChannelMsg.find(function(err,messages){
        //         if(err){
        //             return next(new Error('Failed'));
        //         }
        //         if(messages){
        //             res.send(messages);
        //         }else{
        //             res.send(404,"No messages");
        //         }
        //     });
        //     // res.json(channelMsg);
        // }
        if (err) {
            res.json(500, err);
        } else {
            res.json(userMsg);
        }
    });
};


/**
 * Find messages between two users
 */

exports.messagesForUsers = function (req, res, next) {
    var fromUserId = req.params.fromUserId;
    var toUserId   = req.params.toUserId;

    UserMsg.find({$or: [{FromUserId: fromUserId, ToUserId:toUserId}, {FromUserId: toUserId, ToUserId:fromUserId}]}).lean().exec(function (err, messages) {
        if (err) {
            return next(new Error('Failed to load messages for this conversation'));
        }
        if (messages) {
            // console.log(messages);
            // var newMsgs = {};
            // messages.forEach(function(doc){
            // newMsgs[doc.ChannelId] = doc;
            // newMsgs._id = doc._id;
            // newMsgs.ChannelId = doc.ChannelId;
            // newMsgs.Message = doc.Message;

            // });
            // console.log();
            res.json(messages);
        } else {
            res.send(404, 'CHANNEL_NOT_FOUND')
        }
    });

};


exports.all = function (req, res) {
    UserMsg.find( function (err, messages) {
        if (err) {
            res.json(500, err);
        } else {
            res.json(messages);
        }
    });
};