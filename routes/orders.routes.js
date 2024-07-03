import express from 'express';
import catchAsyncError from '../middlewares/catchAsyncError.middleware.js';
import { createOrder, getAllOrders, getSingleOrder, updateOrder } from '../controllers/order.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.middleware.js';

const ordersRoutes = express.Router();

ordersRoutes
    .post('/', isLoggedIn, catchAsyncError(createOrder))
    .get('/', isLoggedIn, catchAsyncError(getAllOrders))
    .get('/:id', isLoggedIn, catchAsyncError(getSingleOrder))
    .patch('/update/:id', isLoggedIn, catchAsyncError(updateOrder))


export default ordersRoutes;