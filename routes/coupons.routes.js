import express from "express";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";
import { createCoupon, deleteCoupon, getAllCoupons, getCoupon, updateCoupon } from "../controllers/coupons.controller.js";
import isAdmin from "../middlewares/isAdmin.middleware.js";

const couponsRoutes = express.Router();

couponsRoutes
  .post("/", isLoggedIn, isAdmin, catchAsyncError(createCoupon))
  .get("/", isLoggedIn, catchAsyncError(getAllCoupons))
  .put("/update/:id", isLoggedIn, isAdmin, catchAsyncError(updateCoupon))
  .delete("/delete/:id", isLoggedIn, isAdmin, catchAsyncError(deleteCoupon))
  .get("/:id", isLoggedIn, catchAsyncError(getCoupon))
  

export default couponsRoutes;
