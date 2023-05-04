import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { UniqueConstraintError } from 'sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

    let token;
    const { SECRET_KEY } = process.env;
    if (!SECRET_KEY) {
      throw new Error('SECRET_KEY not found.');
    }
    try {
      token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        SECRET_KEY
      );
    } catch (err) {
      return next(createError(500, 'Signup failed.'));
    }

    res.status(201).json({
      message: 'User created.',
      data: {
        token,
        id: user.id,
        preference: user.preference,
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
