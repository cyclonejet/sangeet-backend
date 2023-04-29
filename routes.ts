import { Express, NextFunction, Request, Response } from 'express';
import createError from 'http-errors';

function routes(app: Express) {
  app.get('/', function (req: Request, res: Response) {
    res.sendStatus(200);
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    return next(createError(404, 'Could not find route'));
  });
}

export default routes;
