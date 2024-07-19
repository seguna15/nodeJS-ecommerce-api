import Coupon from "../models/Coupon.model.js";
import ErrorHandler from "../utils/ErrorHandler.util.js";

/**
*   @desc   Create new Coupon
*   @route  POST /api/v1/coupons
*   @access Private/Admin
*/

export const createCoupon = async (req, res) => {

    const { code, startDate, endDate, discount } = req.body;
    //check if admin
    
    //check if coupon exist
    const couponsExist = await Coupon.findOne({
        code
    })

    if (couponsExist) {
        throw new ErrorHandler("Coupon already exist", 409);
    }

    //check if discount in a number
    if(isNaN(discount)){
        throw new ErrorHandler("Coupon discount value should be a number", 400);
    }

    //create coupon 
    const coupon = await Coupon.create({
        code: code?.toUpperCase(), startDate , endDate, discount, user: req.userAuthId
    });

    //return response
    return res.status(201).json({
        success: true,
        message: "Coupon created successfully",
        coupon,
    })
}


/**
*   @desc   GET all Coupon
*   @route  GET /api/v1/coupons
*   @access Private/Admin
*/

export const getAllCoupons = async (req, res) => {
    const coupons  = await Coupon.find();

    //pagination

    //send response
    return res.status(201).json({
      success: true,
      message: "Coupons fetched successfully",
      coupons,
    });
}


/**
*   @desc   GET single Coupon
*   @route  GET /api/v1/coupons/
*   @access Private/Admin
*/
export const getCoupon = async(req, res) => {

  const code  = req.query.code;
  
  const coupon = await Coupon.findOne({code})
  
  //check if not found
  if(coupon === null) throw new ErrorHandler("Coupon not found", 404)

  //check if expired
  if(coupon.isExpired) throw new ErrorHandler("Coupon has expired", 400)

  //send response
  return res.status(201).json({
    success: true,
    message: `${coupon.discount}% discount applied`,
    coupon,
  });
}

/**
*   @desc   UPDATE single Coupon
*   @route  PUT /api/v1/coupons/:id
*   @access Private/Admin
*/
export const updateCoupon = async(req, res) => {
  const { code, startDate, endDate, discount } = req.body;

  //update coupons
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      code: code?.toUpperCase(),
      startDate,
      endDate,
      discount,
    },
    {
      new: true,
    }
  );

  //send response
  return res.status(201).json({
    success: true,
    message: "Coupon updated successfully",
    coupon,
  });
}

/**
*   @desc   DELETE single Coupon
*   @route  DELETE /api/v1/coupons/:id
*   @access Private/Admin
*/
export const deleteCoupon = async(req, res) => {
  //delete coupons
  const coupon = await Coupon.findByIdAndDelete(req.params.id);

  //send response
  return res.status(201).json({
    success: true,
    message: "Coupon deleted successfully",
    coupon,
  });
}