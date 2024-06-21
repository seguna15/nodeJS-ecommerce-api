import express from 'express';
import dbConnect from '../config/dbConnect.js';
import userRoutes from '../routes/user.route.js';
import authRoute from "../routes/auth.route.js";
import { globalErrHandler, notFound } from '../middlewares/globalErrorHandler.js';
import cookieParser from 'cookie-parser';


//db Connect
dbConnect()
const app = express();

//pass incoming data
app.use(express.json())
app.use(cookieParser())

//routes
app.use("/api/v1/auth", authRoute)
app.use("/api/v1/users", userRoutes);


//err middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;