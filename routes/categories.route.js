import express from 'express'
import catchAsyncError from '../middlewares/catchAsyncError.middleware.js';
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from '../controllers/categories.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.middleware.js';

const categoriesRoutes = express.Router()

categoriesRoutes
.post("/",isLoggedIn, catchAsyncError(createCategory))
.get("/", catchAsyncError(getCategories))
.get("/:id", catchAsyncError(getCategory))
.put('/:id/update',isLoggedIn, catchAsyncError(updateCategory))
.delete('/:id/delete',isLoggedIn, catchAsyncError(deleteCategory))

export default categoriesRoutes;