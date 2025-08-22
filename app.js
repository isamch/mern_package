import express from 'express';

// import routes :
import router from './src/routes/router.js';
import authRouter from './src/routes/authRouter.js';

// import db:
import connectDB from './src/config/db.js';

// import middlewares:
import errorHandler from './src/middleware/errorHandler.js';

import cookieParser from "cookie-parser";




const app = express(); // create instance app from express function factory

// middleware: parse JSON
app.use(express.json());
// cookies parser
app.use(cookieParser());


// connect db
await connectDB();

// router :
app.use('/api/test', router);
app.use('/api/auth', authRouter);


// finales middlewares:
app.use(errorHandler); 


export default app;