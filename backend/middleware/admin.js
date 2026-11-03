function admin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "access denied. this is for admin only.",
    });
  }
  next();
}

module.exports = admin;
