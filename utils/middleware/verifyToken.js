const status = require("../statusCodes");
const messages = require("../responseMessages");
const jwt = require("jsonwebtoken");
const UserModel = require("../../userControllers/models/userModel")

require("dotenv").config();

function generateToken(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      is_admin: user.is_admin,
    },
    process.env.JWT_SECRET,
    { expiresIn: "4h" }
  );
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

async function authenticate(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  const resp_body = {}
  let status_code = status.UNAUTHORIZED

  try {
    if (!token) {
      status_code = status.UNAUTHORIZED
      resp_body.message = messages.ACCESS_DENIED
      res.status(status_code).json(resp_body);
    } else {
      const decoded = verifyToken(token);
      req.user = decoded;
      const user_obj = await UserModel.findByPk(req.user.user_id)
      if (user_obj.is_active) {
        next();
      }
      else {
        status_code = status.UNAUTHORIZED
        resp_body.message = messages.INVALID_TOKEN
        res.status(status_code).json(resp_body);
      }
    }
  } catch (error) {
    console.log(error)
    status_code = status.UNAUTHORIZED
    resp_body.message = messages.INVALID_TOKEN
    res.status(status_code).json(resp_body);
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
    if (decoded.is_admin) {
      req.user = decoded;
      next();
    } else {
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
