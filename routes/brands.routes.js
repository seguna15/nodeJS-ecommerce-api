import express from 'express'
import catchAsyncError from '../middlewares/catchAsyncError.middleware.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.middleware.js';
import { createBrand, deleteBrand, getBrand, getBrands, updateBrand } from '../controllers/brands.controller.js';
import isAdmin from '../middlewares/isAdmin.middleware.js';

const brandsRoutes = express.Router()

brandsRoutes
.post("/",isLoggedIn, isAdmin, catchAsyncError(createBrand))
.get("/", catchAsyncError(getBrands))
.get("/:id", catchAsyncError(getBrand))
.put('/:id/update',isLoggedIn, isAdmin, catchAsyncError(updateBrand))
.delete('/:id/delete',isLoggedIn, isAdmin, catchAsyncError(deleteBrand))

export default brandsRoutes;