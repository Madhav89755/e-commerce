const message = require('../../../utils/responseMessages')
const status = require('../../../utils/statusCodes')
const CategoryModel = require('../../models/categoryModel')
const ProductModel = require('../../models/productModel')
const { capitalizeString } = require('./../../../utils/functions')
const { Sequelize, Op } = require('sequelize');


async function addCategory(req, res) {
    /* 
    This function is for adding the category the database table 
    it also returns the json for the category created 
    */
    const resp_body = {}
    let resp_status = status.OK
    try {
        const newCategory = {
            category_name: capitalizeString(req.body.name),
            image_url: req.body.image_url
        }
        if (req.body.group_name) {
            newCategory.group_name = capitalizeString(req.body.group_name)
        }
        if (!newCategory.category_name) {
            resp_body.message = message.CATEGORY_NAME_NOT_FOUND
            resp_status = status.BAD_REQUEST
        } else {
            const category = await CategoryModel.create(newCategory);
            resp_body.data = category
        }

    } catch (e) {
        resp_body.message = e.message;
        resp_status = status.BAD_REQUEST
    }
    res.status(resp_status).json(resp_body);
};


async function fetchCategoryList(req, res) {
    /* 
    This function is for fetching all the categories
    */
    const resp_body = {}
    let resp_status = status.OK
    try {
        const { category_name, group_name, group_by } = req.query;
        const filterOptions = {
            where: {}
        };
        if (category_name) {
            filterOptions.where.category_name = {
                [Op.iLike]: `%${category_name}%`
            };
        }
        if (group_name) {
            filterOptions.where.group_name = {
                [Op.iLike]: `%${group_name}%`
            };
        }
        const categories = await CategoryModel.findAll(filterOptions)
        if (group_by){
            const groups={}
             // Transform the result to group categories by `group_name`
            const groupedCategories = categories.reduce((acc, category) => {
                if (!acc[category.group_name]) {
                    acc[category.group_name] = [];
                }
                acc[category.group_name].push(category);
                return acc;
            }, {});
            resp_body.data=groupedCategories
        }else{
            resp_body.data = categories
        }

    } catch (e) {
        resp_body.message = e.message;
        resp_status = status.BAD_REQUEST
    }
    res.status(resp_status).json(resp_body);
}

async function fetchCategoryDetail(req, res) {
    /* 
    This function is for fetching details for individual category
    */
    const resp_body = {}
    let resp_status = status.OK
    try {
        const id = req.params.id

        const category = await CategoryModel.findByPk(id)
        if (category === null) {
            resp_body.message = message.CATEGORY_ID_NOT_FOUND
        } else {
            resp_body.data = category
        }

    } catch (e) {
        resp_body.message = e.message;
        resp_status = status.BAD_REQUEST
    }
    res.status(resp_status).json(resp_body);
}

async function deleteCategoryDetail(req, res) {
    /* 
    This function is for delete category
    */
    const resp_body = {}
    let resp_status = status.OK
    try {
        const id = req.params.id
        const category = await CategoryModel.findByPk(id)

        if (!category) {
            resp_body.message = message.CATEGORY_ID_NOT_FOUND
            resp_status = status.NOT_FOUND
        } else {
            const product = await ProductModel.findAll({ where: { category_id: category.id } })
            if (!product || product.length == 0) {
                category.destroy();
                resp_body.message = message.CATEGORY_DELETED_SUCCESS
            } else {
                resp_body.message = message.CATEGORY_DELETED_FAILED_PRODUCT_ASSOCIATION
                resp_status = status.BAD_REQUEST
            }
        }
    } catch (e) {
        resp_body.message = e.message;
        resp_status = status.BAD_REQUEST
    }

    res.status(resp_status).json(resp_body);
}

async function updateCategoryDetail(req, res) {
    /* 
    This function is for update category
    */
    const resp_body = {}
    let resp_status = status.OK

    try {
        const id = req.params.id
        const category_name = req.body.name
        const image_url = req.body.image_url
        const group_name = req.body.group_name
        const category_data = {}

        const category = await CategoryModel.findByPk(id)
        if (!category) {
            resp_body.message = message.CATEGORY_ID_NOT_FOUND
            resp_status = status.NOT_FOUND
        } else {
            if (category_name) {
                category_data.category_name = capitalizeString(category_name)
            }
            if (image_url) {
                category_data.image_url = image_url
            }
            if (group_name) {
                category_data.group_name = capitalizeString(group_name)
            }
            category.update(category_data);
            resp_body.message = message.CATEGORY_UPDATED_SUCCESS
        }
    } catch (e) {
        resp_body.message = e.message;
        resp_status = status.BAD_REQUEST
    }
    res.status(resp_status).json(resp_body);
}

async function parentCategoryList(req, res) {
    const resp_body = {}
    let resp_status = status.OK
    try {
        const filterOptions = {
            where: {},
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('group_name')), 'group_name']],
        };
        const categories = await CategoryModel.findAll(filterOptions)
        resp_body.groups=categories.map(category => category.group_name);
    } catch (e) {
        resp_body.message = e.message
        resp_status = status.BAD_REQUEST
    }
    res.status(resp_status).json(resp_body)
}


module.exports = {
    addCategory,
    fetchCategoryList,
    fetchCategoryDetail,
    updateCategoryDetail,
    deleteCategoryDetail,
    parentCategoryList
};