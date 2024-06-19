import jwt from 'jsonwebtoken';

export const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_KEY, { expiresIn: "1d" });
};

export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_KEY, { expiresIn: "7d" });
};

export const getTokenFromHeader = (req) => {
    const token = req?.headers?.authorization?.split(" ")[1];

    if(token === undefined){
        return "No token found in the header";
    }

    return token
}   

export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret, (err, decoded) =>{
        if(err){
            return null;
        }else{
            return decoded;
        }
    })
}
