import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { UniqueConstraintError } from 'sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { CreateUserInput, SigninUserInput } from './usersSchema';
import User from './usersModel';

type JwtPayload = {
  id: string;
  email: string;
  username: string;
};

const { SECRET_KEY } = process.env;
if (!SECRET_KEY) {
  throw new Error('SECRET_KEY not found.');
}

const createToken = (payload: JwtPayload, next: NextFunction): string | any => {
  try {
    return jwt.sign(payload, SECRET_KEY);
  } catch (err) {
    return next(createError(500, 'Signup failed.'));
  }
};

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

    const token = createToken(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      next
    );

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

export const signin = async (
  req: Request<{}, {}, SigninUserInput['body']>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  // check if an user with given email exists
  let user;
  try {
    user = await User.findOne({ where: { email } });
    if (!user) {
      return next(createError(401, { message: `No user with email ${email}` }));
    }
  } catch (err) {
    return next(createError(500, 'Signin failed.'));
  }

  // check password
  let isPasswordCorrect = false;
  try {
    let dbPassword = user.password.replace(/ /g, '');
    isPasswordCorrect = bcrypt.compareSync(password, dbPassword);
    if (!isPasswordCorrect) {
      return next(createError(401, { message: `Wrong password for ${email}` }));
    }
  } catch (err) {
    return next(createError(500, 'Signin failed.'));
  }

  const token = createToken(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    next
  );

  res
    .status(200)
    .json({ token: token, id: user.id, preference: user.preference });
};
