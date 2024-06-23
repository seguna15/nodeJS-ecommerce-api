import Category from "../models/Category.model.js";
import ErrorHandler from "../utils/ErrorHandler.util.js";

/**
*   @desc   Create new Category
*   @route  POST /api/v1/categories
*   @access Private/Admin
*/
export const createCategory = async (req,res) => {
    const {name} = req.body;

    //category exists
    const categoryFound = await Category.findOne({name});
    if(categoryFound){
        throw new ErrorHandler("Category already exists", 409);
    }

    //create
    const  category = await Category.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });

    res.status(200).json({
        success: true,
        message: "Category created successfully",
        category
    })
}

/**
*   @desc   Get all Categories
*   @route  GET /api/v1/categories
*   @access Public
*/

export const getCategories = async (req,res) => {
    const categories = await Category.find()
    
    res.status(200).json({
        success: true,
        message: "Categories created successfully",
        categories
    })
}

/**
*   @desc   Get Single Categories
*   @route  GET /api/v1/categories/:id
*   @access Public
*/

export const getCategory = async (req,res) => {
    const {id} = req.params;
    const category = await Category.findById(id)
    if (!category) {
      throw new ErrorHandler("Category not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Category fetched successfully",
        category
    })
}

/**
 * @desc Update Category
 * @route PUT /api/v1/categories/:id/update
 * @access Private/Admin
*/
export const updateCategory = async (req, res) => {
    
    const { name } = req.body;

    const id = req.params.id;

    const category = await Category.findByIdAndUpdate(id, {
      name,
    },{
        new: true
    });

    if (!category) {
      throw new ErrorHandler("Category not found", 404);
    }

   return res.status(200).json({
        success: true,
        message: "Category updated successfully",
        category,
    })
}


/**
 * @desc Delete category
 * @route DELETE /api/v1/categories/:id/delete
 * @access Private/Admin
*/
export const deleteCategory = async (req, res) => {
    const id = req.params.id;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      throw new ErrorHandler("Category not found", 404);
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      category,
    });
}