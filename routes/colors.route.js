import express from 'express'
import catchAsyncError from '../middlewares/catchAsyncError.middleware.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.middleware.js';
import { createColor, deleteColor, getColor, getColors, updateColor } from '../controllers/colors.controller.js';


const colorsRoutes = express.Router()

colorsRoutes
.post("/",isLoggedIn, catchAsyncError(createColor))
.get("/", catchAsyncError(getColors))
.get("/:id", catchAsyncError(getColor))
.put('/:id/update',isLoggedIn, catchAsyncError(updateColor))
.delete('/:id/delete',isLoggedIn, catchAsyncError(deleteColor))

export default colorsRoutes;