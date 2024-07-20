const models = require("../../models/index");
const status = require("../../../utils/statusCodes");

const User = models.UserModel;

async function fetchUserList(req, res) {
  let status_code=status.OK
  const context={}
  const userList=await User.findAll()
  context.users=userList
  res.status(status_code).json(context)
}


module.exports = {
  fetchUserList
};
