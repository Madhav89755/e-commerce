const models = require("../../models/index");
const status = require("../../../utils/statusCodes");
const messages = require("../../../utils/responseMessages");
const { fetch_unpaid_order } = require("../utility");

const Order = models.OrderModel;
const orderItem = models.OrderItemModel;

async function createOrder(request, response) {
  // either create a new unpaid order or fetch the existing order
  const context = {};
  let status_code = status.CREATED;
  try {
    const shipping_address = request.body.shipping_address;
    const order = await fetch_unpaid_order(request.user.user_id);

    const newOrder = await Order.findByPk(order.order_id)
    await newOrder.update({ shipping_address: shipping_address });

    context.data = newOrder;
    context.order_items = await orderItem.findAll({
      where: { order_id: newOrder.order_id },
    });
  } catch (e) {
    context.message = e.message;
    status_code = status.BAD_REQUEST
  }
  response.status(status_code).json(context);
}

async function fetchOrderList(request, response) {
  // fetch the order list for the logged in user
  let status_code = status.OK;
  const context = {};
  try {
    let user_id = request.user.user_id;
    const order = await Order.findAll({
      where: {
        user_id: user_id,
      },
    });
    context.data = order;
  } catch (e) {
    context.message = e.message;
    status_code = status.BAD_REQUEST
  }
  response.status(status_code).json(context);
}

async function fetchOrderDetail(request, response) {
  // fetch the order list for the logged in user
  const context = {};
  let status_code = status.OK;
  try {
    let user_id = request.user.user_id;
    let order_id = request.params.order_id;
    const order = await Order.findOne({
      where: {
        user_id: user_id,
        order_id: order_id,
      },
    });
    context.data = order;
  } catch (e) {
    context.message = e.message;
    status_code = status.BAD_REQUEST
  }
  response.status(status_code).json(context);
}

async function deleteUnpaidOrder(request, response) {
  // delete an order that is having a status created
  const context = {};
  let status_code = status.OK;
  try {
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
  } catch (e) {
    context.message = e.message;
    status_code = status.BAD_REQUEST
  }
  response.status(status_code).json(context);
}

module.exports = {
  createOrder,
  fetchOrderList,
  fetchOrderDetail,
  deleteUnpaidOrder,
};
