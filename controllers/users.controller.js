import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import ErrorHandler from "../utils/ErrorHandler.js";
import { getTokenFromHeader, generateAccessToken, verifyToken } from "../utils/token.js";


// @desc Register user
// @route POST /api/v1/users/register
// @access Private/Admin

export const registerUser = async (req, res) => {

    const { fullname, email, password } = req.body;

    //check if user exists
    const userExists = await User.findOne({ email });
    if (userExists)
      throw new ErrorHandler("User already exists", 409)

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create the user
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  
};

// @desc Register user
// @route POST /api/v1/users/login
// @access Public

export const loginUser = async (req, res) => {

    const { email, password } = req.body;

    //Find the user by emaisl
    const userFound = await User.findOne({ email });

    if (userFound && (await bcrypt.compare(password, userFound?.password))) {
      return res
        .status(200)
        .json({
          success: true,
          message: "User logged in successfully",
          userFound,
          token: generateAccessToken(userFound._id)
        });
    }

    throw new ErrorHandler("Invalid login credential", 401);
  
};


// @desc Get user profile
// @route POST /api/v1/users/profile
// @access Private
export const getUserProfile = async(req, res) =>{
  
  return res.status(200).json({message: "welcome to profile page."})
}