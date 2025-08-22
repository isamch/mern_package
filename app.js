import express from 'express';
import router from './src/routes/router.js';
import connectDB from './src/config/db.js';
import errorHandler from './src/middleware/errorHandler.js';



const app = express(); // create instance app from express function factory

// middleware: parse JSON
app.use(express.json());


// connectDB();




// router :
app.use('/', router);


// finales middlewares:
app.use(errorHandler); 


export default app;