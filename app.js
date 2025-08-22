import express from 'express';

// import routes :
import router from './src/routes/router.js';
import authRouter from './src/routes/authRouter.js';

// import db:
import connectDB from './src/config/db.js';

// import middlewares:
import errorHandler from './src/middleware/errorHandler.js';



const app = express(); // create instance app from express function factory

// middleware: parse JSON
app.use(express.json());


// connectDB();


// router :
app.use('/', router);
app.use('/', authRouter);


// finales middlewares:
app.use(errorHandler); 


export default app;