import express from 'express'
import catchAsyncError from '../middlewares/catchAsyncError.middleware.js';
import { createAccessory, deleteAccessory, getAccessories, getAccessory, updateAccessory } from '../controllers/accessories.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.middleware.js';
import upload from '../config/fileUpload.js';
import isAdmin from '../middlewares/isAdmin.middleware.js';

const accessoriesRoutes = express.Router()

accessoriesRoutes
.post("/",isLoggedIn, isAdmin, upload.single('file'), catchAsyncError(createAccessory))
.get("/", catchAsyncError(getAccessories))
.get("/:id", catchAsyncError(getAccessory))
.put('/:id/update',isLoggedIn, isAdmin, catchAsyncError(updateAccessory))
.delete('/:id/delete',isLoggedIn, isAdmin, catchAsyncError(deleteAccessory))

export default accessoriesRoutes;