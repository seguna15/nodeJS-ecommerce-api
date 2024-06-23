import User from "../models/User.model.js";

// @desc Get user profile
// @route POST /api/v1/users/profile
// @access Private
export const getUserProfile = async(req, res) =>{
  
  return res.status(200).json({message: "welcome to profile page."})
}