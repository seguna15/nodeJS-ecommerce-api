import express from 'express'
import { isLoggedIn } from '../middlewares/isLoggedIn.middleware.js';
import catchAsyncError from '../middlewares/catchAsyncError.middleware.js';
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/products.controller.js';

const productsRoutes = express.Router();

productsRoutes
  .post("/", isLoggedIn, catchAsyncError(createProduct))
  .get("/", catchAsyncError(getProducts))
  .get("/:id", catchAsyncError(getProduct))
  .put("/:id/update", isLoggedIn, catchAsyncError(updateProduct))
  .delete("/:id/delete", isLoggedIn, catchAsyncError(deleteProduct))

   

export default productsRoutes