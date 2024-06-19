import express from "express";
import { getUserProfile, loginUser, registerUser } from "../controllers/users.controller.js";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const userRoutes = express.Router();

userRoutes
    .post('/register',catchAsyncError(registerUser))
    .post('/login',catchAsyncError(loginUser))
    .get('/profile',isLoggedIn,catchAsyncError(getUserProfile))

export default userRoutes

