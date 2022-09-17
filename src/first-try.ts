import express, { Request, Response, NextFunction } from 'express';
import { router as userRouter } from './users/router.js';

const host = '127.0.0.1';
const port = 8000;

const app = express();

app.use((req, res, next) => {
	console.log('Time', Date.now());
	next();
});

//order of methods is important
app.all('/hello', (req, res, next) => {
	console.log('All');
	next();
});

app.get('/hello', (req, res) => {
	console.log({ req });
	res.cookie('coooka', 'nya', {
		domain: '',
		path: '/hello',
		secure: false,
		expires: new Date(2023, 2),
	});
	res.status(200).download('./index.js');
});

app.use('/users', userRouter);

//error handler, also should be at the end of declaration/usage of routes
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.log(err);
	res.status(500).send(err.message);
});

app.listen(port, () => {
	console.log(`Server is running on: ${host}:${port}`);
});

// const server = http.createServer((req, res) => {
// 	res.statusCode = 200;
// 	res.setHeader('Content-type', 'text/plain');
// 	res.end('Hello world')
// });

// server.listen(port, host, () => {
// 	console.log(`Server is running on: ${host}:${port}`);
// })
