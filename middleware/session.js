const crypto = require('crypto');

const sessions = {};

module.exports = (req, res, next) => {
  if (req.cookies.sessionId && sessions[req.cookies.sessionId]) {
    req.session = sessions[req.cookies.sessionId];
  } else {
    const sessionId = crypto.randomBytes(8).toString('hex');

    const session = {
      id: sessionId
    };

    sessions[sessionId] = session;

    res.cookie('sessionId', sessionId);

    req.session = session;
  }

  next();
};
