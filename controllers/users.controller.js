import User from "../models/User.model.js";


/**
 * @desc Get all customers 
 * @route GET /api/v1/users/customers
 * @access Private
 */
export const getAllCustomers = async (req, res) => {
  const customers = await User.find({isAdmin: false})

  return res.status(200).send({
    success: true,
    message: "Users fetched successfully",
    customers
  })
}

/**
 * @desc Get user profile
 * @route POST /api/v1/users/profile
 * @access Private
 */
export const getUserProfile = async(req, res) =>{
  //find user
  const userFound = await User.findById(req.userAuthId).select("fullname email orders isAdmin hasShippingAddress createdAt shippingAddress wishLists").populate('orders');
  return res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    userFound
  })
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
