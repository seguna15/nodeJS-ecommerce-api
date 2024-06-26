import User from "../models/User.model.js";

/**
 * @desc Get user profile
 * @route POST /api/v1/users/profile
 * @access Private
 */
export const getUserProfile = async(req, res) =>{
  
  return res.status(200).json({message: "welcome to profile page."})
}

/**
 * @desc Get user profile
 * @route POST /api/v1/users/update/shipping
 * @access Private
 */
export const updateShippingAddress = async (req, res) => {
  const {firstName, lastName, address, city, postalCode, province, country, phoneNumber} = req.body;

  //find user
  const user = await User.findByIdAndUpdate(req.userAuthId, {
    shippingAddress: {
      firstName,
      lastName,
      address,
      city,
      postalCode,
      province,
      country,
      phoneNumber,
    },
    hasShippingAddress: true
  }, {new: true});

  return res.status(201).json({
    success: true,
    message: "User shipping address updated successfully",
    user
  })
}
