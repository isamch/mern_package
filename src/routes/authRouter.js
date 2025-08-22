import express from 'express';
import { singUpController } from './../controllers/authController.js'
import { signupSchema, loginSchema } from "../validations/validatorSchema.js";
import { validate } from './../middleware/validatorMiddleware.js'


const router = express.Router();




router.get('/signup', validate(signupSchema), singUpController);






export default router;