import express from 'express';
import { registerController, loginController, logoutController } from './../controllers/authController.js'
import { registerSchema, loginSchema } from "../validations/validatorSchema.js";
import { validate } from './../middleware/validatorMiddleware.js'

import { authMiddleware } from './../middleware/authMiddleware.js';

const router = express.Router();



router.get('/register', validate(registerSchema), registerController);
router.get('/login', validate(loginSchema), loginController);

router.get('/logout', authMiddleware, logoutController);






export default router;