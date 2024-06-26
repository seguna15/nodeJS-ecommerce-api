import User from "../models/User.model.js";
import bcrypt from 'bcryptjs';
import ErrorHandler from "../utils/ErrorHandler.util.js";
import {  generateAccessToken, generateRefreshToken, verifyToken } from "../utils/token.util.js";
import { cookieOptions } from "../utils/genCookiesOptions.util.js";


// @desc Register user
// @route POST /api/v1/auth/register
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
// @route POST /api/v1/auth/login
// @access Public

export const loginUser = async (req, res) => {
    const cookies = req.cookies;
    
    const { email, password } = req.body;
    

    //Find the user by email
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
        const foundToken = await User.findOne({sessions: refreshToken });
        
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

    throw new ErrorHandler("Invalid login credential", 40);
  
};



// @desc Refresh access token
// @route POST /api/v1/auth/refresh
// @access Public
export const refreshAccessToken = async(req, res) => {
  const cookies = req.cookies;
  //return forbidden if cookies is not present
  if(!cookies?.AuthCookies) throw new ErrorHandler('No cookie found', 403);

  const refreshToken = cookies?.AuthCookies;
  
  const userFound = await User.findOne({sessions: refreshToken })
  
  //detect reuse of token which does not exist on db
  if (!userFound) {
    const verifiedFakeToken = verifyToken(refreshToken, process.env.JWT_REFRESH_KEY);

    // if token is invalid and just clear token 
    if(!verifiedFakeToken){
      res.clearCookie("AuthCookies", { httpOnly: true });
      throw new ErrorHandler("Token is invalid", 403);
       
    } 
    
    // finding hacked user
    const hackedUser = await User.findOne({ _id: verifiedFakeToken.id });

    hackedUser.sessions = [];
    await hackedUser.save();
    res.clearCookie("AuthCookies", { httpOnly: true });
    throw new ErrorHandler("Token is invalid", 403);

  }

  // Verify the token sent by the found user
  const verifiedUserToken =  verifyToken(refreshToken, process.env.JWT_REFRESH_KEY);

  
  // delete the token from the list of refresh token  if it is invalid
  if(!verifiedUserToken){
    userFound.sessions = userFound.sessions.filter((session) => session !== refreshToken)
    await userFound.save();
    res.clearCookie("AuthCookies", { httpOnly: true });
    throw new ErrorHandler("Token is invalid", 403);
  }


  const accessToken = generateAccessToken(userFound._id);

  return res.status(200).json({success: true, accessToken})

}


// @desc Logout User
// @route POST /api/v1/auth/logout
// @access Public

export const logoutUser = async (req, res) => {
  const cookies = req.cookies;

  //if no cookie comes with the request logout the user
  if(!cookies?.AuthCookies){
      return res.status(200).json({ success: true,  message: "user logged out successfully" });
  }

  //get cookie and find the user with the cookies
  const refreshToken = cookies.AuthCookies;
  const userFound = await User.findOne({sessions: refreshToken});
  
  // if no user is found  with the token clear cookies and send response to consuming service
  if(!userFound) {
    return res
      .clearCookie("AuthCookies", {
        httpOnly: true,
      })
      .status(200)
      .json({ success: true, message: "user logged out successfully" });
  }

  // clearCookie
  userFound.sessions =  userFound.sessions.filter((session) => session !== refreshToken)
  await userFound.save();
  return res
    .clearCookie("AuthCookies", {
      httpOnly: true,
    })
    .status(200)
    .json({ success: true, message: "user logged out successfully" });
  
}