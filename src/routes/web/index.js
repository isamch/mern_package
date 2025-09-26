import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
	return res.render('index', { title: 'Home', message: 'Welcome to EJS Home' });
});

export default router; 