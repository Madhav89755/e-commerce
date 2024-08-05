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
        if (isMatch && user.is_active) {
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

async function userProfileData(req, res){
  let status_code=status.OK
  const context={}
  try{
    const user_id=req.user.user_id
    const user_obj=await User.findByPk(user_id)
    if (user_obj){
      context.user_data=user_obj
    }else{
      context.message=messages.USER_NOT_FOUND
      status_code=status.BAD_REQUEST
    }
  } catch (e) {
    context.message = e.message;
    status_code = status.BAD_REQUEST
  }
  res.status(status_code).json(context)
}

async function updatePassword(req, res){
  const resp_body = {};
  let resp_status = status.OK;
  try {
    const { currentPassword, newPassword } = req.body;
    const user_obj=await User.findByPk(req.user.user_id)
    if (user_obj){
      const isMatch = await bcrypt.compare(currentPassword, user_obj.password);
      if (!isMatch){
        resp_body.message=messages.INVALID_CREDENTIALS
        resp_status=status.BAD_REQUEST
      }else{
        if (currentPassword == newPassword){
          resp_body.message=messages.CURRENT_AND_NEW_PASSWORD_SAME
          resp_status=status.BAD_REQUEST
        }else{
          user_obj.password=newPassword
          await user_obj.save()
          resp_body.message=messages.PASSWORD_UPDATED_SUCCESS
        }
      }
    }else{
      resp_body.message=messages.USER_NOT_FOUND
      resp_status=status.BAD_REQUEST
    }
  } catch (error) {
    resp_body.message = error.message;
    resp_status = status.INTERNAL_SERVER_ERROR;
  }

  res.status(resp_status).json(resp_body);
}

module.exports = {
  createUser,
  loginUser,
  userProfileData,
  updatePassword
};
