import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import ErrorHandler from "../utils/ErrorHandler.js";
import {  generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { cookieOptions } from "../utils/genCookiesOptions.js";


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
    const cookies = req.cookies;
    console.log(req.cookies)
    const { email, password } = req.body;
    

    //Find the user by emall
    const userFound = await User.findOne({ email });

    if (userFound && (await bcrypt.compare(password, userFound?.password))) {
      const newRefreshToken = generateRefreshToken(userFound._id);

      // if no token was sent during login maintain the current refreshToken list but if there is token maintain the token list without the current token

      let newSessionArray = !cookies?.AuthCookies
        ? userFound.sessions
        : userFound.sessions.filter(
            (session) => session !== cookies?.AuthCookies
          );

      // if auth cookies exist
      if (cookies?.AuthCookies) {
        //check if it in the list and if not delete all tokens to prevent fraud attempt
        const refreshToken = cookies?.AuthCookies;
        const foundToken = await User.findOne({ refreshToken });

        if (!foundToken) {
          newSessionArray = [];
        }

        res.clearCookie("AuthCookies", { httpOnly: true });
      }

      //Save refresh Token
      userFound.sessions = [...newSessionArray, newRefreshToken];
      await userFound.save();

      const { password, sessions, ...rest } = userFound._doc;

      return res
        .status(200)
        .cookie("AuthCookies", newRefreshToken, cookieOptions)
        .json({
          success: true,
          message: "User logged in successfully",
          userData: rest,
          token: generateAccessToken(userFound._id),
        });
    }

    throw new ErrorHandler("Invalid login credential", 401);
  
};

