import express from 'express';
import routes from './routes';

var app = express();

routes(app);

export default app;
