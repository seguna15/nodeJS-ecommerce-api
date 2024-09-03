import express from "express";
import { getAllCustomers, getUserProfile, updateShippingAddress } from "../controllers/users.controller.js";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";
import isAdmin from "../middlewares/isAdmin.middleware.js";

const usersRoutes = express.Router();

usersRoutes
  .get("/customers", isLoggedIn, isAdmin, catchAsyncError(getAllCustomers))
  .get("/profile", isLoggedIn, catchAsyncError(getUserProfile))
  .patch(
    "/update/shipping",
    isLoggedIn,
    catchAsyncError(updateShippingAddress)
  );

export default usersRoutes

