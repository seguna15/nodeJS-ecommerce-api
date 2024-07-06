import express from 'express'
import upload from '../config/fileUpload.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.middleware.js';
import catchAsyncError from '../middlewares/catchAsyncError.middleware.js';
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/products.controller.js';
import isAdmin from '../middlewares/isAdmin.middleware.js';

const productsRoutes = express.Router();

productsRoutes
  .post("/", isLoggedIn, isAdmin, upload.array('files'),catchAsyncError(createProduct))
  .get("/", catchAsyncError(getProducts))
  .get("/:id", catchAsyncError(getProduct))
  .put("/:id/update", isLoggedIn, isAdmin, catchAsyncError(updateProduct))
  .delete("/:id/delete", isLoggedIn, isAdmin, catchAsyncError(deleteProduct))

   

export default productsRoutes;