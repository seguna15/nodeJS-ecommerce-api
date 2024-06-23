import express from "express";
import { getUserProfile } from "../controllers/users.controller.js";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";

const usersRoutes = express.Router();

usersRoutes
    .get('/profile',isLoggedIn,catchAsyncError(getUserProfile))

export default usersRoutes

