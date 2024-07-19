import Color from "../models/Color.model.js";
import ErrorHandler from "../utils/ErrorHandler.util.js";

/**
*   @desc   Create new Color
*   @route  POST /api/v1/colors
*   @access Private/Admin
*/
export const createColor = async (req,res) => {
    const {name} = req.body;

    //color exists
    const colorFound = await Color.findOne({name: name.toLowerCase()});
    if(colorFound){
        throw new ErrorHandler("Color already exists", 409);
    }

    //create
    const  color = await Color.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });

    res.status(200).json({
        success: true,
        message: "Color created successfully",
        color
    })
}

/**
*   @desc   Get all Colors
*   @route  GET /api/v1/colors
*   @access Public
*/

export const getColors = async (req,res) => {
    const colors = await Color.find()
    
    res.status(200).json({
        success: true,
        message: "Colors created successfully",
        colors
    })
}

/**
*   @desc   Get Single Colors
*   @route  GET /api/v1/colors/:id
*   @access Public
*/

export const getColor = async (req,res) => {
    const {id} = req.params;
    const color = await Color.findById(id)
    if (!color) {
      throw new ErrorHandler("Color not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Color fetched successfully",
        color
    })
}

/**
 * @desc Update Color
 * @route PUT /api/v1/colors/:id/update
 * @access Private/Admin
*/
export const updateColor = async (req, res) => {
    
    const { name } = req.body;

    const id = req.params.id;

    const color = await Color.findByIdAndUpdate(id, {
      name,
    },{
        new: true
    });

    if (!color) {
      throw new ErrorHandler("Color not found", 404);
    }

   return res.status(200).json({
        success: true,
        message: "Color updated successfully",
        color,
    })
}


/**
 * @desc Delete color
 * @route DELETE /api/v1/colors/:id/delete
 * @access Private/Admin
*/
export const deleteColor = async (req, res) => {
    const id = req.params.id;

    const color = await Color.findByIdAndDelete(id);

    if (!color) {
      throw new ErrorHandler("Color not found", 404);
    }

    return res.status(200).json({
      success: true,
      message: "Color deleted successfully",
      color,
    });
}