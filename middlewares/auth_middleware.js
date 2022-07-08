const jwt = require("jsonwebtoken")
const config = process.env

exports.authMiddleware = function authMiddleware(req, res, next) {
  const token = req.headers["x-access-token"]
  if (!token) {
    return res.status(403).json({ error: "This resource requires authentication" })
  }

  try {
    req.user = jwt.verify(token, config.TOKEN_KEY)
    return next()
  } catch (err) {
    res.status(401).json({ error: "Invalid access token" })
  }
}
