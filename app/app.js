import express from 'express';
import dbConnect from '../config/dbConnect.js';
import usersRoutes from '../routes/users.route.js';
import authRoute from "../routes/auth.route.js";
import { globalErrHandler, notFound } from '../middlewares/globalErrorHandler.middleware.js';
import cookieParser from 'cookie-parser';
import productsRoutes from '../routes/products.route.js';
import categoriesRoutes from '../routes/categories.route.js';
import brandsRoutes from '../routes/brands.route.js';
import colorsRoutes from '../routes/colors.route.js';
import reviewsRoutes from '../routes/review.route.js';


//db Connect
dbConnect()
const app = express();

//pass incoming data
app.use(express.json())
app.use(cookieParser())

//routes
app.use("/api/v1/auth", authRoute)
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/products", productsRoutes)
app.use("/api/v1/categories", categoriesRoutes)
app.use("/api/v1/brands", brandsRoutes)
app.use("/api/v1/colors", colorsRoutes)
app.use('/api/v1/reviews', reviewsRoutes)


//err middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;