const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "my_secret_key");
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "bad token",
    });
  }
}

module.exports = auth;
