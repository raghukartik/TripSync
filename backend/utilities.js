const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.cookies.token; // ✅ Read token from cookies

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden (invalid token)

    req.user = user; // decoded payload from token
    next();
  });
}

module.exports = {
  authenticateToken,
};
