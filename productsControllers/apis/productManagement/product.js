const { Sequelize, Op } = require('sequelize');
const message=require('../../../utils/responseMessages')
const status=require('../../../utils/statusCodes')
const models = require('../../models/index')

const ProductModel=models.ProductModel
const CategoryModel=models.CategoryModel

async function addProductToList(req, res){
    /*
    API allows you to add products to the database
    */

    let status_code=status.CREATED
    const context={}
    try{
        const name=req.body.product.name
        const description=req.body.product.description
        const price = req.body.product.price
        const stock_count=req.body.product.stock_count
        const image_url = req.body.product?.image_url || null

        const newProduct = {
            name,
            description,
            price,
            stock_count,
            image_url
        }

        const category_id=req.body.category_id
        if (category_id){
            const id=category_id
            const category=await CategoryModel.findByPk(id)
            if (category){
                newProduct.category_id=category_id
            }
        }

        const product=await ProductModel.create(newProduct)
        context.data=product
        context.message=message.PRODUCT_ADDED_SUCCESS

    }catch(e){
        context.message=e.message;
        status_code=status.BAD_REQUEST
    }
    res.status(status_code).json(context)
};

async function fetchProduct(req, res){
    /*
    API allows you to fetch product list
    */
    let status_code=status.OK
    const context={}
    try{
        const { name, category_id, min_stock_count } = req.query;
        const filterOptions = {
            where: {}
        };
        if (name) {
            filterOptions.where.name = {
                [Op.iLike] : `%${name}%`
            };
        }        
        if (category_id) {
            filterOptions.where.category_id = category_id;
        }
        if (min_stock_count) {
            filterOptions.where.stock_count = {
              [Sequelize.Op.gte]: parseInt(min_stock_count)
            };
        }

        
        const product=await ProductModel.findAll(filterOptions)
        context.data=product
    }catch(e){
        context.message=e.message;
        status_code=status.BAD_REQUEST
    }
    res.status(status_code).json(context)
};

async function fetchProductDetail(req, res){
    /*
    API allows you to fetch individual product details from the database
    */

    let status_code=status.OK
    const context={}
    try{
        const id=req.params.id
        const product=await ProductModel.findByPk(id)
        if (product===null){
            context.message=message.PRODUCT_NOT_FOUND
            status_code=status.NOT_FOUND
        }else{
            context.data=product
        }
    }catch(e){
        context.message=e.message;
        status_code=status.BAD_REQUEST
    }
    res.status(status_code).json(context)
};

async function deleteProduct(req, res){
    /**
     * API to delete a product
     */
    let status_code=status.OK
    const resp_body={}
    try{
        const id=req.params.id
        const product=await ProductModel.destroy({where:{id}})
        if (!product){
            resp_body.message=message.PRODUCT_NOT_FOUND
            status_code=status.NOT_FOUND
        }else{
            resp_body.message=message.PRODUCT_DELETED_SUCCESS
        }
    }catch(e){
        resp_body.message=e.message;
        status_code=status.BAD_REQUEST
    }
    res.status(status_code).json(resp_body)
}

async function updateProductDetails(req, res){
    let status_code = status.OK
    const context={}
    try{
        const id=req.params.id
        const product=await ProductModel.findByPk(id)
        if (product===null){
            resp_body.message=message.PRODUCT_NOT_FOUND
            status_code=status.NOT_FOUND
        }else{
            product.update(req.body)
            context.data=product
            context.message=message.PRODUCT_UPDATED_SUCCESS
        }
    }catch(e){
        context.message=e.message;
        status_code=status.BAD_REQUEST
    }
    res.status(status_code).json(context)
}

module.exports = {
    addProductToList,
    fetchProduct,
    fetchProductDetail,
    deleteProduct,
    updateProductDetails
}