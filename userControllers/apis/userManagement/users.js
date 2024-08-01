const models = require("../../models/index");
const { Op } = require('sequelize');

const status = require("../../../utils/statusCodes");
const messages = require("../../../utils/responseMessages");
const jwt = require("../../../utils/middleware/verifyToken");
const bcrypt = require("bcrypt");

const User = models.UserModel;

async function createUser(req, res) {
  const resp_body = {};
  let resp_status = status.CREATED;
  try {
    let is_admin = req.body.is_admin;
    const { email, password, full_name } = req.body;

    if (!is_admin) {
      is_admin = false
    } else {
      is_admin = true
    }

    if (!full_name || !email || !password) {
      resp_body.message = messages.FULL_NAME_EMAIL_PASSWORD_REQUIRED;
      resp_status = status.BAD_REQUEST;
    } else {
      const checkUser = await User.findOne({ where: { email } });
      if (checkUser === null) {
        const newUser = await User.create({
          full_name,
          email,
          password,
          is_admin
        });
        resp_body.data = newUser;
      } else {
        resp_body.message = messages.USER_ALREADY_EXISTS
        resp_status = status.BAD_REQUEST
      }
    }

  } catch (error) {
    resp_body.message = error.message;
    resp_status = status.INTERNAL_SERVER_ERROR;
  }
  res.status(resp_status).json(resp_body);
}

async function loginUser(req, res) {
  const resp_body = {};
  let resp_status = status.OK;
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      resp_body.message = messages.EMAIL_PASSWORD_REQUIRED;
      resp_status = status.BAD_REQUEST;
    } else {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        resp_body.message = messages.USER_NOT_FOUND;
        resp_status = status.NOT_FOUND;
      } else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          resp_body.message = messages.LOGIN_SUCCESSFULL;
          resp_body.data = {
            token: jwt.generateToken(user),
            is_admin: user.is_admin
          };
        } else {
          resp_body.message = messages.INVALID_CREDENTIALS;
          resp_status = status.UNAUTHORIZED;
        }
      }
    }
  } catch (error) {
    resp_body.message = error.message;
    resp_status = status.INTERNAL_SERVER_ERROR;
  }

  res.status(resp_status).json(resp_body);
}


module.exports = {
  createUser,
  loginUser
};
