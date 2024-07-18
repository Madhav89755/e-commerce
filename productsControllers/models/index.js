
const CategoryModel=require('./categoryModel')
const ProductModel=require('./productModel')



CategoryModel.sync({ alter: true }).then(()=>{
    console.log("Category model sync success");
    ProductModel.sync({ alter: true }).then(()=>{
        console.log("Product model sync success");
    }).catch(err=>{
        console.log("Product model sync error", err);
    })
}).catch(err=>{
    console.log("Category model sync error", err);
})

  

module.exports = {
    CategoryModel,
    ProductModel
}