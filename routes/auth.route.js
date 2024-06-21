import express from "express";
import {loginUser, registerUser } from "../controllers/auth.controller.js";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";

const authRoute = express.Router();

authRoute
    .post('/register',catchAsyncError(registerUser))
    .post('/login',catchAsyncError(loginUser))

export default authRoute

