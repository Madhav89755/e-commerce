const OrderModel=require('./orderModel')
const OrderItemModel=require('./orderItemModel')


OrderModel.sync({ alter: true }).then(()=>{
    console.log("Order model sync success");
    OrderItemModel.sync({ alter: true }).then(()=>{
        console.log("Order Item model sync success");
    }).catch(err=>{
        console.log("Order Item model sync error", err);
    })
}).catch(err=>{
    console.log("Order model sync error", err);
})

module.exports = {
    OrderModel,
    OrderItemModel
}