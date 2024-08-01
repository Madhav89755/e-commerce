const models = require("../../models/index");
const status = require("../../../utils/statusCodes");
const { Op } = require('sequelize')
const User = models.UserModel;

async function fetchUserList(req, res) {
  const context = {}
  let status_code = status.OK
  try {
    const { full_name, email, is_admin } = req.query;
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


module.exports = {
  fetchUserList
};
