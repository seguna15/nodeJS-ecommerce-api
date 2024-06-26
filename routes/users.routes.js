import express from "express";
import { getUserProfile, updateShippingAddress } from "../controllers/users.controller.js";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";

const usersRoutes = express.Router();

usersRoutes
  .get("/profile", isLoggedIn, catchAsyncError(getUserProfile))
  .patch("/update/shipping", isLoggedIn, catchAsyncError(updateShippingAddress));

export default usersRoutes

