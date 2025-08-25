import express from 'express';
import { registerController, loginController, logoutController } from './../controllers/authController.js'
import { registerSchema, loginSchema } from "../validations/validatorSchema.js";
import { validate } from './../middleware/validatorMiddleware.js'

import { authMiddleware } from './../middleware/authMiddleware.js';

const router = express.Router();



router.post('/register', validate(registerSchema), registerController);
router.post('/login', validate(loginSchema), loginController);

router.post('/logout', authMiddleware, logoutController);



router.get('/home', authMiddleware, (req, res) => {
  return res.json({
    message: "hello to home"
  });
});




export default router;