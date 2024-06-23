import ErrorHandler from "../utils/ErrorHandler.util.js";

export const globalErrHandler = (err, req, res, next) => {
  //stack
  //statusCode
  //message
  const stack = err?.stack;
  const statusCode = err?.statusCode ? err?.statusCode : 500;
  const message = err?.message ? err?.message : "Oops something went wrong";
  
  
  res.status(statusCode).json({
    success: false,
    stack,
    message,
  });
}

//404 handler
export const notFound = (req, res, next) => {
    const err = new ErrorHandler(`Route ${req.originalUrl} not found`, 404)
    next(err)
}