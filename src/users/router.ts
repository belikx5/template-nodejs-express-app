import express from 'express';

// don't need as we have users controller
export const router = express.Router();

//the same as router.all('/hello')
router.use('/hello', (req, res, next) => {
	console.log('User handler');
	next();
});

router.get('/hello', (req, res) => {
	throw new Error('Errorrrrr');
});

router.post('/login', (req, res) => {
	res.send('login');
});

router.post('/register', (req, res) => {
	res.send('register');
});
