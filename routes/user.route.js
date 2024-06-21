import express from "express";
import { getUserProfile } from "../controllers/users.controller.js";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const userRoutes = express.Router();

userRoutes
    .get('/profile',isLoggedIn,catchAsyncError(getUserProfile))

export default userRoutes

