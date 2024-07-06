import express from 'express';
import catchAsyncError from '../middlewares/catchAsyncError.middleware.js';
import { createOrder, getAllOrders, getOrderStats, getSingleOrder, updateOrder } from '../controllers/order.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.middleware.js';
import isAdmin from '../middlewares/isAdmin.middleware.js';

const ordersRoutes = express.Router();

ordersRoutes
    .post('/', isLoggedIn, catchAsyncError(createOrder))
    .get('/', isLoggedIn, catchAsyncError(getAllOrders))
    .get('/sales/stats', isLoggedIn, catchAsyncError(getOrderStats))
    .get('/:id', isLoggedIn, catchAsyncError(getSingleOrder))
    .patch('/update/:id', isLoggedIn, isAdmin, catchAsyncError(updateOrder))


export default ordersRoutes;