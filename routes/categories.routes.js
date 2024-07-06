import express from 'express'
import catchAsyncError from '../middlewares/catchAsyncError.middleware.js';
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from '../controllers/categories.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.middleware.js';
import upload from '../config/fileUpload.js';
import isAdmin from '../middlewares/isAdmin.middleware.js';

const categoriesRoutes = express.Router()

categoriesRoutes
.post("/",isLoggedIn, isAdmin, upload.single('file'), catchAsyncError(createCategory))
.get("/", catchAsyncError(getCategories))
.get("/:id", catchAsyncError(getCategory))
.put('/:id/update',isLoggedIn, isAdmin, catchAsyncError(updateCategory))
.delete('/:id/delete',isLoggedIn, isAdmin, catchAsyncError(deleteCategory))

export default categoriesRoutes;