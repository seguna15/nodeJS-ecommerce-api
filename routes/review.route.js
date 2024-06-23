import express from 'express';
import catchAsyncError from '../middlewares/catchAsyncError.middleware.js';
import { createReview } from '../controllers/reviews.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.middleware.js';

const reviewsRoutes = express.Router();

reviewsRoutes
    .post('/:productID',isLoggedIn, catchAsyncError(createReview))



export default reviewsRoutes;