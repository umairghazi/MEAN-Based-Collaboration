
/**
 *  Route middleware to ensure user is authenticated.
 */
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.send(401);
}


/**
 * Chat authorizations routing middleware
 */
exports.chat = {
  hasAuthorization: function(req, res, next) {
    if (req.chat.sender._id.toString() !== req.user._id.toString()) {
      return res.send(403);
    }
    next();
  }
};
