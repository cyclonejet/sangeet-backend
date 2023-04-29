import express, { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';

import routes from './routes';

var app = express();

routes(app);

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (err.statusCode) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    console.log(err.stack);
    res.status(500).send('Internal server error');
  }
});

export default app;
