const models = require("../../models/index");
const status = require("../../../utils/statusCodes");
const messages = require("../../../utils/responseMessages");
const moment = require("moment");

const Order = models.OrderModel;

async function createOrder(request, response) {
  const context = {};
  let status_code = status.CREATED;
  const user_id = request.user.user_id;
  const order = await Order.findOrCreate({
    where: {
      user_id,
      is_paid: false,
    },
  });
  if (order === null || !order) {
    context.message = messages.USER_NOT_FOUND;
    status_code = status.NOT_FOUND;
  } else {
    context.message = messages.ORDER_CREATED;
    context.data = order;
  }
  response.status(status_code).json(context);
}

async function fetchOrderList(request, response) {
  let status_code = status.OK;
  const context = {};
  const order = await Order.findAll({
    where: {
      user_id: request.user.user_id,
    },
  });
  context.data = order;
  response.status(status_code).json(context);
}

async function confirmOrderPayment(request, response) {
  let status_code = status.OK;
  const context = {};
  const order_id = request.params.order_id;
  const order = await Order.findOne({
    where: {
      user_id: request.user.user_id,
      order_id: order_id,
    },
  });
  if (!order) {
    context.message = messages.ORDER_NOT_FOUND;
    status_code = status.NOT_FOUND;
  } else if (order.is_paid) {
    context.message = messages.ORDER_PAYMENT_CAPTURED_ALREADY;
  } else {
    order.update({
      is_paid: true,
      paid_on: moment().format(),
    });
    context.message = messages.ORDER_PAYMENT_CAPTURED;
  }
  context.data = order;
  response.status(status_code).json(context);
}

async function deleteUnpaidOrder(request, response) {
  let status_code = status.OK;
  const context = {};
  const order_id = request.params.order_id;
  const order = await Order.findOne({
    where: {
      user_id: request.user.user_id,
      order_id: order_id,
    },
  });
  if (!order) {
    context.message = messages.ORDER_NOT_FOUND;
    status_code = status.NOT_FOUND;
  } else if (order.is_paid) {
    context.message = messages.ORDER_PAYMENT_CAPTURED_ALREADY;
  } else {
    order.destroy();
    context.message = messages.ORDER_DELETED;
  }
  context.data = order;
  response.status(status_code).json(context);
}

module.exports = {
  createOrder,
  fetchOrderList,
  confirmOrderPayment,
  deleteUnpaidOrder
};
