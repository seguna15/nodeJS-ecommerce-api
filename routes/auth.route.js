import express from "express";
import {loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/auth.controller.js";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";

const authRoute = express.Router();

authRoute
    .post('/register',catchAsyncError(registerUser))
    .post('/login',catchAsyncError(loginUser))
    .post('/refresh', catchAsyncError(refreshAccessToken))
    .post('/logout', catchAsyncError(logoutUser))

export default authRoute

