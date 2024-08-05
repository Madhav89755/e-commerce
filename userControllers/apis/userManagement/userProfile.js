const models = require("../../models/index");
const status = require("../../../utils/statusCodes");
const messages = require("../../../utils/responseMessages");
const bcrypt = require("bcrypt");
const User = models.UserModel;

async function userProfileData(req, res) {
    let status_code = status.OK
    const context = {}
    try {
        const user_id = req.user.user_id
        const user_obj = await User.findByPk(user_id)
        if (user_obj) {
            context.user_data = user_obj
        } else {
            context.message = messages.USER_NOT_FOUND
            status_code = status.BAD_REQUEST
        }
    } catch (e) {
        context.message = e.message;
        status_code = status.BAD_REQUEST
    }
    res.status(status_code).json(context)
}



async function updatePassword(req, res) {
    const resp_body = {};
    let resp_status = status.OK;
    try {
        const { currentPassword, newPassword } = req.body;
        const user_obj = await User.findByPk(req.user.user_id)
        if (user_obj) {
            const isMatch = await bcrypt.compare(currentPassword, user_obj.password);
            if (!isMatch) {
                resp_body.message = messages.INVALID_CREDENTIALS
                resp_status = status.BAD_REQUEST
            } else {
                if (currentPassword == newPassword) {
                    resp_body.message = messages.CURRENT_AND_NEW_PASSWORD_SAME
                    resp_status = status.BAD_REQUEST
                } else {
                    user_obj.password = newPassword
                    await user_obj.save()
                    resp_body.message = messages.PASSWORD_UPDATED_SUCCESS
                }
            }
        } else {
            resp_body.message = messages.USER_NOT_FOUND
            resp_status = status.BAD_REQUEST
        }
    } catch (error) {
        resp_body.message = error.message;
        resp_status = status.INTERNAL_SERVER_ERROR;
    }

    res.status(resp_status).json(resp_body);
}


module.exports = {
    userProfileData,
    updatePassword
}