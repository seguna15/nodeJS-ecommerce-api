import express from "express";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";
import { createCoupon, deleteCoupon, getAllCoupons, getCoupon, updateCoupon } from "../controllers/coupons.controller.js";

const couponsRoutes = express.Router();

couponsRoutes
  .post("/", isLoggedIn, catchAsyncError(createCoupon))
  .get("/", isLoggedIn, catchAsyncError(getAllCoupons))
  .put("/update/:id", isLoggedIn, catchAsyncError(updateCoupon))
  .delete("/delete/:id", isLoggedIn, catchAsyncError(deleteCoupon))
  .get("/:id", isLoggedIn, catchAsyncError(getCoupon))
  

export default couponsRoutes;
