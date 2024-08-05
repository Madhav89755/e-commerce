const models = require("../../models/index");
const status = require("../../../utils/statusCodes");
const { Op } = require('sequelize');
const responseMessages = require("../../../utils/responseMessages");
const { response } = require("express");
const User = models.UserModel;

async function fetchUserList(req, res) {
  const context = {}
  let status_code = status.OK
  try {
    const { full_name, email, is_admin, user_id } = req.query;
    const filterOptions = {
      where: {}
    };

    if (full_name) {
      filterOptions.where.full_name = {
        [Op.iLike]: `%${full_name}%`
      };
    }

    if (email) {
      filterOptions.where.email = email;
    }

    if (user_id) {
      filterOptions.where.user_id = user_id;
    }

    if (is_admin) {
      filterOptions.where.is_admin=is_admin
    }

    const userList = await User.findAll(filterOptions)
    context.users = userList
  } catch (e) {
    context.message = e.message;
    status_code = status.BAD_REQUEST
  }
  res.status(status_code).json(context)
}

async function updateUserActiveStatus(req, res){
  const context={}
  let status_code=status.OK
  try{
    const { user_id, action }=req.body
    const user_obj=await User.findByPk(user_id)
    if (user_obj){
      switch (action) {
        case "activate":
          user_obj.is_active=true
          await user_obj.save()
          context.message=responseMessages.USER_ACTIVATED
          break;
        case "deactivate":
          user_obj.is_active=false
          await user_obj.save()
          context.message=responseMessages.USER_DEACTIVATED
          break;
          
        default:
          context.message=responseMessages.INVALID_CHOICE
          status_code=status.BAD_REQUEST
          break;
      }
    }
    else{
      context.message=responseMessages.USER_NOT_FOUND
      status_code=status.BAD_REQUEST
    }
  } catch (e) {
    context.message = e.message;
    status_code = status.BAD_REQUEST
  }
  res.status(status_code).json(context)
}

module.exports = {
  fetchUserList,
  updateUserActiveStatus
};
