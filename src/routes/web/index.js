import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
	return res.render('pages/index', { title: 'Home', message: 'Welcome to EJS Home' });
});

export default router; 