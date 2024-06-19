import ErrorHandler from "../utils/ErrorHandler.js";
import { getTokenFromHeader, verifyToken } from "../utils/token.js"

export const isLoggedIn = (req, res, next) => {
    //get token from header
    const token  = getTokenFromHeader(req);
    
    //verify the token
    const decodedUser = verifyToken(token, process.env.JWT_ACCESS_KEY)
    
    if(!decodedUser){
        
        throw new ErrorHandler('Invalid/Expired token, please login again', 401)
    }

    //save the user into the req obj
    req.userAuthId = decodedUser?.id
    next()
}