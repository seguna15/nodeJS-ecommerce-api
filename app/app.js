import express from 'express';
import dbConnect from '../config/dbConnect.js';
import userRoutes from '../routes/user.route.js';
import { globalErrHandler, notFound } from '../middlewares/globalErrorHandler.js';

//db Connect
dbConnect()
const app = express();

//pass incoming data
app.use(express.json())

//routes
app.use("/api/v1/users", userRoutes);

//err middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;