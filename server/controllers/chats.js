
var mongoose = require('mongoose');
var Chat = mongoose.model('Chat');

/**
 * Find chat by id
 */
exports.chat = function(req, res, next, id) {
  Chat.load(id, function(err, chat) {
    if (err) return next(err);
    if (!chat) return next(new Error('Failed to load chat ' + id));
    req.chat = chat;
    next();
  });
};

/**
 * Create a chat
 */
exports.create = function(req, res) {
  var chat = new Chat(req.body);
  chat.creator = req.user;

  chat.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(chat);
    }
  });
};

// /**
//  * Update a chat
//  */
// exports.update = function(req, res) {
//   var blog = req.blog;
//   blog.title = req.body.title;
//   blog.content = req.body.content;
//   blog.save(function(err) {
//     if (err) {
//       res.json(500, err);
//     } else {
//       res.json(blog);
//     }
//   });
// };

/**
 * Delete a chat
 */
exports.destroy = function(req, res) {
  var chat = req.chat;

  chat.remove(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(chat);
    }
  });
};

/**
 * Show a blog
 */
exports.show = function(req, res) {
  res.json(req.chat);
};

/**
 * List of Chats
 */
exports.all = function(req, res) {
  Chat.find().sort('-created').populate('creator', 'username').exec(function(err, chats) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(chats);
    }
  });
};
