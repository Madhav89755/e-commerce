const models = require("../models/index");
const productModels= require("../../productsControllers/models/index")

const Order = models.OrderModel;
const OrderItem = models.OrderItemModel
const Product=productModels.ProductModel

async function fetch_unpaid_order(user_id) {
  const order = await Order.findOrCreate({
    where: {
      user_id: user_id,
      status: "created",
    },
  });
  return order[0]
}


async function isProductStockAvailable(id, quantityNeeded){
  const product=await Product.findByPk(id)
  const orderItems=await OrderItem.findAll({where: {product_id:product.id}})
  let total_product_booked=0
  let qty_remaining=0
  for(const element of orderItems) {
    total_product_booked=total_product_booked+parseInt(element.quantity)
  }
  if (total_product_booked<product.stock_count){
    qty_remaining=product.stock_count-total_product_booked
    if (qty_remaining==quantityNeeded||qty_remaining>quantityNeeded){
      return true
    }
  }
  return false
}


async function calculatePriceForOrder(order_id){
  let order= await Order.findByPk(order_id)
  const orderItem = await OrderItem.findAll({where: {order_id}})
  let total_order_price=parseFloat(0)
  for (const item of orderItem) {
    const id=item.product_id
    const product_price = (await Product.findByPk(id)).price
    total_order_price=total_order_price+(parseFloat(item.quantity)*parseFloat(product_price))
  }
  order=order.update({total_amount:total_order_price})
  return order
}


module.exports={
  fetch_unpaid_order,
  isProductStockAvailable,
  calculatePriceForOrder
} 