import express from 'express';
import catchAsyncError from '../middlewares/catchAsyncError.middleware.js';
import { createOrder } from '../controllers/order.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.middleware.js';

const ordersRoutes = express.Router();

ordersRoutes
    .post('/', isLoggedIn, catchAsyncError(createOrder))


export default ordersRoutes;