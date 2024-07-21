const orderModels = require("../../../ordersControllers/models/index");
const userModels = require("../../models/index");
const status = require("../../../utils/statusCodes");
const messages = require("../../../utils/responseMessages");

async function getOrders(request, response) {
  let status_code = status.OK;
  const context = {};
  const user_id = request.params.user_id;
  const order_id = request.params.order_id;
  if (!user_id) {
    const orders = await orderModels.OrderModel.findAll({
      include: orderModels.OrderItemModel,
    });
    context.orders = orders;
  } else {
    const orders = await orderModels.OrderModel.filter({
      where: { user_id: user_id },
    });
    context.orders = orders;
  }
  response.status(status_code).json(context);
}

module.exports = {
    getOrders,
};
