const message=require('../../../utils/responseMessages')
const status=require('../../../utils/statusCodes')
const CategoryModel = require('../../models/categoryModel')
const ProductModel = require('../../models/productModel')


async function addCategory(req, res){
    /* 
    This function is for adding the category the database table 
    it also returns the json for the category created 
    */
   const resp_body={}
   let resp_status=status.OK
   
   const newCategory={
       category_name:req.body.name,
       image_url:req.body.image_url
    }
    
    if (!newCategory.category_name) {
        resp_body.message= message.CATEGORY_NAME_NOT_FOUND
        resp_status=status.BAD_REQUEST
    }else{
        const category=await CategoryModel.create(newCategory);
        resp_body.data=category
    }
    
    res.status(resp_status).json(resp_body);
};


async function fetchCategoryList(req, res){
    /* 
    This function is for fetching all the categories
    */
    const resp_body={}
    let resp_status=status.OK

    const category=await CategoryModel.findAll()
    resp_body.data=category

    res.status(resp_status).json(resp_body);
}

async function fetchCategoryDetail(req, res){
    /* 
    This function is for fetching details for individual category
    */
    const resp_body={}
    let resp_status=status.OK

    const id=req.params.id

    const category=await CategoryModel.findByPk(id)
    if (category === null){
        resp_body.message=message.CATEGORY_ID_NOT_FOUND
    }else{
        resp_body.data=category
    }

    res.status(resp_status).json(resp_body);
}

async function deleteCategoryDetail(req, res){
    /* 
    This function is for delete category
    */
    const resp_body={}
    let resp_status=status.OK

    const id=req.params.id
    const category = await CategoryModel.findByPk(id)

    if (!category){
        resp_body.message=message.CATEGORY_ID_NOT_FOUND
        resp_status=status.NOT_FOUND
    }else{
        const product = await ProductModel.findAll({where: {category_id:category.id}})
        if (!product||product.length==0){
            category.destroy();
            resp_body.message=message.CATEGORY_DELETED_SUCCESS
        }else{
            resp_body.message=message.CATEGORY_DELETED_FAILED_PRODUCT_ASSOCIATION
            resp_status=status.BAD_REQUEST
        }
    }

    res.status(resp_status).json(resp_body);
}

async function updateCategoryDetail(req, res){
    /* 
    This function is for delete category
    */
    const resp_body={}
    let resp_status=status.OK

    const id=req.params.id
    const category_name=req.body.category_name
    const image_url=req.body.image_url
    const category_data={}

    const category=await CategoryModel.findByPk(id)
    if (!category){
        resp_body.message=message.CATEGORY_ID_NOT_FOUND
        resp_status=status.NOT_FOUND
    }else{
        if (category_name){
            category_data.category_name=category_name
        }
        if (image_url){
            category_data.image_url=image_url
        }
        category.update(category_data);      
        resp_body.message=message.CATEGORY_UPDATED_SUCCESS
    }

    res.status(resp_status).json(resp_body);
}



module.exports = {
    addCategory,
    fetchCategoryList,
    fetchCategoryDetail,
    updateCategoryDetail,
    deleteCategoryDetail
};