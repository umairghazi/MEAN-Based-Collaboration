var mongoose = require('mongoose');
var ChannelMsg = mongoose.model('ChannelMsg');
var User = mongoose.model('User');
var ObjectId = mongoose.Types.ObjectId;

exports.messages = function (req, res, next, id) {
    ChannelMsg.load(id, function (err, chat) {
        if (err) return next(err);
        if (!chat) return next(new Error('Failed to load channel messages ' + id));
        req.chat = chat;
        next();
    });
};

/**
 * Create a channel message
 */
exports.create = function (req, res) {
    
    var channelMsg = new ChannelMsg(req.body);
    channelMsg.ChannelId = req.body.channelId;
    channelMsg.Message.uid = req.body.uid;
    channelMsg.Message.body = req.body.body;
    channelMsg.Message.timestamp = Date.now();
    channelMsg.Message.username = req.body.username;
    channelMsg.Message.encodedname = req.body.encodedName;

    channelMsg.save(function (err) {
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
            res.json(channelMsg);
        }
    });
};

exports.uploadFile = function (req, res) {
    
    // var channelMsg = new ChannelMsg(req.body);
    // channelMsg.ChannelId = req.body.channelId;
    // channelMsg.Message.uid = req.body.uid;
    // channelMsg.Message.body = req.body.body;
    // channelMsg.Message.timestamp = Date.now();
    // channelMsg.Message.username = req.body.username;
    //
    // channelMsg.save(function (err) {
    //     // if (err) {
    //     //     res.json(500, err);
    //     // } else {
    //     //     ChannelMsg.find(function(err,messages){
    //     //         if(err){
    //     //             return next(new Error('Failed'));
    //     //         }
    //     //         if(messages){
    //     //             res.send(messages);
    //     //         }else{
    //     //             res.send(404,"No messages");
    //     //         }
    //     //     });
    //     //     // res.json(channelMsg);
    //     // }
    //     if (err) {
    //         res.json(500, err);
    //     } else {
    //         res.json(channelMsg);
    //     }
    // });
};


/**
 * Find messages for specific channel
 */

exports.messagesForChannel = function (req, res, next) {
    var channelId = req.params.channelId;

    ChannelMsg.find({ChannelId: channelId}).lean().exec(function (err, messages) {
        if (err) {
            return next(new Error('Failed to load messages for this channel'));
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