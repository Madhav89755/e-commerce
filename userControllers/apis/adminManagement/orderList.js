const orderModels = require("../../../ordersControllers/models/index");
const userModels = require("../../models/index");
const status = require("../../../utils/statusCodes");
const messages = require("../../../utils/responseMessages");

async function getOrders(request, response) {
  let status_code = status.OK;
  const context = {};
  const user_id = request.query.user_id;
  if (!user_id) {
    const orders = await orderModels.OrderModel.findAll({
      include: orderModels.OrderItemModel,
    });
    context.orders = orders;
  } else {
    const orders = await orderModels.OrderModel.filter({
      include: orderModels.OrderItemModel,
      where: { user_id: user_id },
    });
    context.orders = orders;
  }
  response.status(status_code).json(context);
}

async function confirmOrderPayment(request, response) {
  // confirm the payment capture for the order that is shipped
  let status_code = status.OK;
  const context = {};
  const order_id = request.params.order_id;
  const order = await orderModels.OrderModel.findOne({
    where: {
      user_id: request.user.user_id,
      order_id: order_id,
    },
  });
  if (!order) {
    context.message = messages.ORDER_NOT_FOUND;
    status_code = status.NOT_FOUND;
  } else if (order.status === "paid") {
    context.message = messages.ORDER_PAYMENT_CAPTURED_ALREADY;
    status_code = status.BAD_REQUEST;
  } else if (order.status === "created") {
    context.message = messages.ORDER_NOT_SHIPPED;
    status_code = status.BAD_REQUEST;
  } else {
    order.update({
      paid_on: moment().format(),
      status: "paid",
    });
    context.message = messages.ORDER_PAYMENT_CAPTURED;
  }
  context.data = order;
  response.status(status_code).json(context);
}

async function confirmOrderShippment(request, response) {
  // confirm the payment capture for the order that is shipped
  let status_code = status.OK;
  const context = {};
  const order_id = request.params.order_id;
  const order = await orderModels.OrderModel.findOne({
    where: {
      user_id: request.user.user_id,
      order_id: order_id,
      status: "created",
    },
  });
  if (!order) {
    context.message = messages.ORDER_NOT_FOUND;
    status_code = status.NOT_FOUND;
  } else {
    order.update({
      status: "shipped",
    });
    context.message = messages.ORDER_SHIPPED;
  }
  context.data = order;
  response.status(status_code).json(context);
}

module.exports = {
    getOrders,
    confirmOrderPayment,
    confirmOrderShippment,
};
