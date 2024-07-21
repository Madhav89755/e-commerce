const models = require("../../models/index");
const prouctModels = require("../../../productsControllers/models/index");
const status = require("../../../utils/statusCodes");
const messages = require("../../../utils/responseMessages");
const {
  fetch_unpaid_order,
  isProductStockAvailable,
  calculatePriceForOrder,
} = require("../utility");

const Order = models.OrderModel;
const OrderItem = models.OrderItemModel;
const ProductModel = prouctModels.ProductModel;

async function addItemsToOrder(request, response) {
  // Add a new item to an unpaid order that is in created state
  const context = {};
  let status_code = status.CREATED;
  const id = request.body.product_id;

  const product = await ProductModel.findByPk(id);
  if (product === null) {
    status_code = status.NOT_FOUND;
    context.message = messages.PRODUCT_NOT_FOUND;
  } else {
    const order = await fetch_unpaid_order(request.user.user_id);
    const order_item = (
      await OrderItem.findOrCreate({
        where: {
          product_id: id,
          order_id: order.order_id,
          user_id: request.user.user_id,
        },
      })
    )[0];
    context.order = await calculatePriceForOrder(order.order_id);
    context.order_item = order_item;
  }
  response.status(status_code).json(context);
}

async function updateItemQtyInOrder(request, response) {
  // Update the quantity of the item in an unpaid order
  const context = {};
  let status_code = status.CREATED;
  const id = request.body.product_id;
  const new_quantity = request.body.new_quantity;

  const product = await ProductModel.findByPk(id);

  if (product === null) {
    status_code = status.NOT_FOUND;
    context.message = messages.PRODUCT_NOT_FOUND;
  } else {
    const item_id = request.params.item_id;
    const order_item = await OrderItem.findOne({where:{item_id, user_id:request.user.user_id}});
    const order = await Order.findOne({
      where: {
        order_id: order_item.order_id,
        status: "created",
      },
    });
    if (order == null) {
      context.message = messages.ORDER_PAID_OR_SHIPPED;
    } else {
      order_item.update({ quantity: new_quantity });

      context.order = await calculatePriceForOrder(order.order_id);
      context.order_item = order_item;
    }
  }
  response.status(status_code).json(context);
}

async function removeItemFromOrder(request, response) {
  let status_code = status.OK;
  const context = {};

  const item_id = request.params.item_id;
  const order_item = await OrderItem.findOne({item_id, user_id:request.user.user_id,});
  if (order_item === null) {
    context.message = messages.ORDER_ITEM_NOT_FOUND;
    status_code = status.NOT_FOUND;
  } else {
    const order_id = order_item.order_id;

    await order_item.destroy();
    context.order = await calculatePriceForOrder(order_id);

    context.message = messages.ORDER_ITEM_DELETED;
  }
  response.status(status_code).json(context);
}

module.exports = {
  addItemsToOrder,
  updateItemQtyInOrder,
  removeItemFromOrder,
};
