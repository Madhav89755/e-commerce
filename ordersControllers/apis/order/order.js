const models = require("../../models/index");
const status = require("../../../utils/statusCodes");
const messages = require("../../../utils/responseMessages");
const { fetch_unpaid_order } = require("../utility");
const moment = require("moment");

const Order = models.OrderModel;
const orderItem = models.OrderItemModel;

async function createOrder(request, response) {
  // either create a new unpaid order or fetch the existing order
  const context = {};
  let status_code = status.CREATED;
  const shipping_address = request.body.shipping_address;
  const order = await fetch_unpaid_order(request.user.user_id);

  const newOrder=await Order.findByPk(order.order_id)
  await newOrder.update({ shipping_address: shipping_address });

  context.data = newOrder;
  context.order_items = await orderItem.findAll({
    where: { order_id: newOrder.order_id },
  });
  response.status(status_code).json(context);
}

async function fetchOrderList(request, response) {
  // fetch the order list for the logged in user
  let status_code = status.OK;
  const context = {};
  let user_id = request.user.user_id;
  const order = await Order.findAll({
    where: {
      user_id: user_id,
    },
  });
  context.data = order;
  response.status(status_code).json(context);
}

async function fetchOrderDetail(request, response) {
  // fetch the order list for the logged in user
  let status_code = status.OK;
  const context = {};
  let user_id = request.user.user_id;
  let order_id = request.params.order_id;
  const order = await Order.findOne({
    where: {
      user_id: user_id,
      order_id: order_id,
    },
  });
  context.data = order;
  response.status(status_code).json(context);
}

async function confirmOrderPayment(request, response) {
  // confirm the payment capture for the order that is shipped
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
  const order = await Order.findOne({
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

async function deleteUnpaidOrder(request, response) {
  // delete an order that is having a status created
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
  } else if (order.status === "created") {
    order.destroy();
    context.message = messages.ORDER_DELETED;
  } else {
    context.message = messages.ORDER_CAN_NOT_BE_DELETED;
    status_code = status.BAD_REQUEST;
  }
  context.data = order;
  response.status(status_code).json(context);
}

module.exports = {
  createOrder,
  fetchOrderList,
  fetchOrderDetail,
  confirmOrderPayment,
  confirmOrderShippment,
  deleteUnpaidOrder,
};
