import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { UniqueConstraintError } from 'sequelize';
import bcrypt from 'bcrypt';

import { CreateUserInput } from './usersSchema';
import User from './usersModel';

export const signup = async (
  req: Request<{}, {}, CreateUserInput['body']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;

    const SALT_WORK_FACTOR = process.env.SALT_WORK_FACTOR;

    if (SALT_WORK_FACTOR === undefined) {
      throw new Error('SALT_WORK_FACTOR environment variable not found.');
    }

    const salt = bcrypt.genSaltSync(parseInt(SALT_WORK_FACTOR));
    const hash = bcrypt.hashSync(password, salt);

    const user = await User.create({
      username,
      email,
      password: hash,
    });

    res.status(201).json({
      message: 'User created',
      data: {
        username,
        email,
      },
    });
  } catch (error: any) {
    if (error instanceof UniqueConstraintError) {
      if ('email' in error.fields) {
        return next(createError(409, 'User with given email already exists.'));
      } else if ('username' in error.fields) {
        return next(
          createError(409, 'User with given username already exists.')
        );
      }
    }

    return next(createError(500, error.message));
  }
};
