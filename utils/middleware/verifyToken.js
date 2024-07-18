const status = require("../statusCodes");
const messages = require("../responseMessages");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateToken(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      is_admin: user.is_admin,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

function authenticate(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(status.UNAUTHORIZED)
      .json({ message: messages.ACCESS_DENIED });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(status.UNAUTHORIZED).json({ message: messages.INVALID_TOKEN });
  }
}

function authenticate_admin(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(status.UNAUTHORIZED)
      .json({ message: messages.ACCESS_DENIED });
  }

  try {
    const decoded = verifyToken(token);
    if (decoded.is_admin){
      req.user = decoded;
      next();
    }else{
      res.status(status.FORBIDDEN).json({ message: messages.USER_NOT_AUTHORIZED });
    }
  } catch (error) {
    res.status(status.UNAUTHORIZED).json({ message: messages.INVALID_TOKEN });
  }
}

module.exports = {
  authenticate,
  authenticate_admin,
  generateToken,
};
