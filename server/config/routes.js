var express = require('express');
var path = require('path');
var auth = require('../config/auth');
var fs = require('fs-extra');
var crypto = require('crypto');
var base64url = require('base64url');
var formidable = require('formidable');

var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();

function randomStringAsBase64Url(size) {
    return base64url(crypto.randomBytes(size));
}


module.exports = function (app, io) {

    // User Routes
    var users = require('../controllers/users');
    app.post('/auth/users', users.create);
    app.get('/auth/users/:userId', users.show);
    app.get('/auth/users', users.all);


    // Check if username is available
    app.get('/auth/check_username/:username', users.exists);

    // Session Routes
    var session = require('../controllers/session');
    app.get('/auth/session', auth.ensureAuthenticated, session.session);
    app.post('/auth/session', session.login);
    app.del('/auth/session', session.logout);


    //Channel Routes
    var channels = require('../controllers/channels');
    app.get('/api/channels', auth.ensureAuthenticated, channels.all);
    app.post('/api/channels', channels.create);
    app.get('/api/channels/:channelId', channels.showName);
    app.del('/api/channels/:channelId', auth.ensureAuthenticated, channels.destroy);


    //User Chat Routes

    var userChats = require('../controllers/userMessages');

    app.post('/api/chats/users', auth.ensureAuthenticated, function (req, res) {
        userChats.create(req, res);
        req.body.timestamp = Date.now();

        var send = {
            FromUserId: req.body.fromUserId,
            ToUserId: req.body.toUserId,
            Message: {
                timestamp: req.body.timestamp,
                body: req.body.body
            }
        };

        io.sockets.emit('userposted', send);

    });

    app.get('/api/chats/users', userChats.all);
    app.get('/api/chats/users/:fromUserId/:toUserId', userChats.messagesForUsers);


    // Channel Chat Routes
    var chats = require('../controllers/chats');
    // app.get('/api/chats', chats.all);
    // app.post('/api/chats', auth.ensureAuthenticated, chats.create);
    // app.get('/api/chats/:chatId', chats.show);
    // app.put('/api/chats/:chatId', auth.ensureAuthenticated, auth.blog.hasAuthorization, chats.update);
    // app.del('/api/chats/:chatId', auth.ensureAuthenticated, auth.chat.hasAuthorization, chats.destroy);

    var channelMessages = require('../controllers/channelMessages');
    app.post('/api/chats', auth.ensureAuthenticated, function (req, res) {
        channelMessages.create(req, res);
        req.body.timestamp = Date.now();

        var send = {
            ChannelId: req.body.channelId,
            Message: {
                username: req.body.username,
                body: req.body.body,
                timestamp: req.body.timestamp,
                uid: req.body.uid,
                encodedname: req.body.encodedName
            }
        };

        io.sockets.emit('posted', send);

    });
    app.get('/api/chats', channelMessages.messages);
    app.get('/api/chats/:channelId', channelMessages.messagesForChannel);


    //Upload file route
    // app.use('/static', express.static('uploads'), function (req, res) {
    //     console.log("here");
    // });

    var fileEnc = require('../controllers/filenameEnc');
    app.post('/api/chats/uploads', multipartyMiddleware, function (req, res, next) {
        var tmp_path = req.files.file.path;
        req.body.originalName = req.files.file.name;
        req.body.modifiedName = randomStringAsBase64Url(20);
        fileEnc.create(req, res); //Database entry for original and encoded names
        var target_path = 'uploads/' + req.body.modifiedName;
        fs.rename(tmp_path, target_path, function (err) {
            if (err) throw err;
            // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
            fs.unlink(tmp_path, function () {
                if (err) throw err;
                // res.send('File uploaded to: ' + target_path + ' - ' + req.files.file.size + ' bytes');
            });
        });
        res.json({
            modifiedName: req.body.modifiedName,
            originalName: req.body.originalName,
            username: req.body.username,
            channelname: req.body.channelname,
            timestamp: Date.now(),
            userid: req.body.userid
        });
    });


    // app.post('/api/chats/uploads', function (req, res) {
    //
    //     // create an incoming form object
    //     var form = new formidable.IncomingForm();
    //     // specify that we want to allow the user to upload multiple files in a single request
    //     form.multiples = true;
    //
    //     // store all uploads in the /uploads directory
    //     form.uploadDir = path.join('./uploads');
    //
    //     // every time a file has been uploaded successfully,
    //     // rename it to it's orignal name
    //     form.on('file', function (field, file) {
    //         fs.rename(file.path, path.join(form.uploadDir, file.name));
    //     });
    //
    //     // log any errors that occur
    //     form.on('error', function (err) {
    //         console.log('An error has occured: \n' + err);
    //     });
    //
    //     // once all the files have been uploaded, send a response to the client
    //     form.on('end', function () {
    //         res.end('success');
    //     });
    //
    //     // parse the incoming request containing the form data
    //     form.parse(req);
    // });

    app.get('/download', function (req, res) { // create download route
        // var path = require('path'); // get path
        var dir = path.resolve(".") + '/uploads/'; // give path
        fs.readdir(dir, function (err, list) { // read directory return  error or list
            if (err) return res.json(err);
            else
                res.json(list);
        });

    });


    app.get('/getFile/:file(*)', function (req, res, next) { // this routes all types of file
        var file = req.params.file;
        var filepath = './uploads/' + file;
        fileEnc.findFile(req, res, function (err, data) {
            if (data === null) {
                res.json('no such file found - ' + file);
            } else {
                originalName = data.originalName;
                var targetpath = './uploads/' + originalName;

                fs.copy(filepath, targetpath, function (err) {
                    if (err) throw err;
                    var path = require('path');
                    var path = path.resolve(".") + '/uploads/' + originalName;
                    res.download(path); // magic of download fuction
                });
                fs.remove(targetpath, function (err) {
                    if (err) console.error(err);
                    console.log('removed');
                });
            }
        });
    });

    io.on('connection', function (socket) {
        console.log('client connected');
        socket.on('fromClient', function (data) {
            channelMessages.uploadFile(data);
        });
    });


    //Setting up the chatId param
    app.param('chatId', chats.chat);

    // Angular Routes
    app.get('/partials/*', function (req, res) {
        var requestedView = path.join('./', req.url);
        res.render(requestedView);
    });


    // app.get('/*', function (req, res) {
    //     if (req.user) {
    //         res.cookie('user', JSON.stringify(req.user.user_info));
    //     }
    //res.render('index.html');
    // });

};
