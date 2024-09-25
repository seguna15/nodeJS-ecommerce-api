import Accessory from "../models/Accessory.model.js";
import ErrorHandler from "../utils/ErrorHandler.util.js";

/**
*   @desc   Create new Accessory
*   @route  POST /api/v1/accessories
*   @access Private/Admin
*/
export const createAccessory = async (req,res) => {
   
    const convertedImage = req.file.path;
    const {name} = req.body;
    
    //accessory exists
    const accessoryFound = await Accessory.findOne({name: name.toLowerCase()});
    if(accessoryFound){
        throw new ErrorHandler("Accessory already exists", 409);
    }

    //create
    const accessory = await Accessory.create({
      name: name?.toLowerCase(),
      user: req.userAuthId,
      image: convertedImage,
    });

    return res.status(201).json({
        success: true,
        message: "Accessory created successfully",
        accessory
    })
}

/**
*   @desc   Get all Accessories
*   @route  GET /api/v1/accessories
*   @access Public
*/

export const getAccessories = async (req,res) => {
    const accessories = await Accessory.find().populate("user")
    
    res.status(200).json({
        success: true,
        message: "Accessories created successfully",
        accessories
    })
}

/**
*   @desc   Get Single Accessories
*   @route  GET /api/v1/accessories/:id
*   @access Public
*/

export const getAccessory = async (req,res) => {
    const {id} = req.params;
    const accessory = await Accessory.findById(id)
    if (!accessory) {
      throw new ErrorHandler("Accessory not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Accessory fetched successfully",
        accessory
    })
}

/**
 * @desc Update Accessory
 * @route PUT /api/v1/accessories/:id/update
 * @access Private/Admin
*/
export const updateAccessory = async (req, res) => {
    
    const { name } = req.body;

    const id = req.params.id;

    const accessory = await Accessory.findByIdAndUpdate(id, {
      name,
    },{
        new: true
    });

    if (!accessory) {
      throw new ErrorHandler("Accessory not found", 404);
    }

   return res.status(200).json({
        success: true,
        message: "Accessory updated successfully",
        accessory,
    })
}


/**
 * @desc Delete accessory
 * @route DELETE /api/v1/accessories/:id/delete
 * @access Private/Admin
*/
export const deleteAccessory = async (req, res) => {
    const id = req.params.id;

    const accessory = await Accessory.findByIdAndDelete(id);

    if (!accessory) {
      throw new ErrorHandler("Accessory not found", 404);
    }

    return res.status(200).json({
      success: true,
      message: "Accessory deleted successfully",
      accessory,
    });
}