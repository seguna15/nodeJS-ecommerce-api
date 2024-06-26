import express from 'express';
import dbConnect from '../config/dbConnect.js';
import usersRoutes from '../routes/users.routes.js';
import authRoute from "../routes/auth.routes.js";
import { globalErrHandler, notFound } from '../middlewares/globalErrorHandler.middleware.js';
import cookieParser from 'cookie-parser';
import productsRoutes from '../routes/products.routes.js';
import categoriesRoutes from '../routes/categories.routes.js';
import brandsRoutes from '../routes/brands.routes.js';
import colorsRoutes from '../routes/colors.routes.js';
import reviewsRoutes from '../routes/reviews.routes.js';
import ordersRoutes from '../routes/orders.routes.js';


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
app.use('/api/v1/orders', ordersRoutes)


//err middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;