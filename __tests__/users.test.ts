import supertest from 'supertest';
import app from '../app';
import * as UsersController from '../components/users/usersController';
import { initializeDb, sequelize } from '../bin/initializeDB';
import User from '../components/users/usersModel';

const USER_SIGNUP_ROUTE = '/api/users/signup';
const USER_SIGNIN_ROUTE = '/api/users/signin';

const userInput = {
  email: 'test123456@pm.me',
  password: 'test123456',
  passwordConfirmation: 'test123456',
  username: 'test123456',
};

const userSigninInput = {
  email: 'test123456@pm.me',
  password: 'test123456',
};

const userPayload = {
  message: 'User created',
  data: {
    username: 'test123456',
    email: 'test123456@pm.me',
  },
};

describe('user', () => {
  describe('create user', () => {
    describe('validator tests: testing components/users/usersSchema.js', () => {
      describe('if passwords do not match', () => {
        it('should return 400', async () => {
          const { statusCode, body } = await supertest(app)
            .post(USER_SIGNUP_ROUTE)
            .send({ ...userInput, passwordConfirmation: 'pwdoesntmatch' });

          expect(statusCode).toBe(400);
          expect(body.message).toBe('Passwords do not match.');
        });
      });

      describe('if passwordConfirmation is not provided', () => {
        it('should return 400', async () => {
          const { statusCode, body } = await supertest(app)
            .post(USER_SIGNUP_ROUTE)
            .send({
              email: userInput.email,
              password: userInput.password,
              username: userInput.username,
            });

          expect(statusCode).toBe(400);
          expect(body.message).toBe('Confirm password is required.');
        });
      });

      describe('if email is not valid', () => {
        it('should return 400', async () => {
          const { statusCode, body } = await supertest(app)
            .post(USER_SIGNUP_ROUTE)
            .send({ ...userInput, email: 'test123456' });

          expect(statusCode).toBe(400);
          expect(body.message).toBe('Invalid email.');
        });
      });

      describe('if email is not provided', () => {
        it('should return 400', async () => {
          const { statusCode, body } = await supertest(app)
            .post(USER_SIGNUP_ROUTE)
            .send({
              password: userInput.password,
              passwordConfirmation: userInput.passwordConfirmation,
              username: userInput.username,
            });

          expect(statusCode).toBe(400);
          expect(body.message).toBe('Email is required.');
        });
      });

      describe('if username is not provided', () => {
        it('should return 400', async () => {
          const { statusCode, body } = await supertest(app)
            .post(USER_SIGNUP_ROUTE)
            .send({
              email: userInput.email,
              password: userInput.password,
              passwordConfirmation: userInput.passwordConfirmation,
            });

          expect(statusCode).toBe(400);
          expect(body.message).toBe('Username is required.');
        });
      });

      describe('if username length is not enough', () => {
        it('should return 400', async () => {
          const { statusCode, body } = await supertest(app)
            .post(USER_SIGNUP_ROUTE)
            .send({ ...userInput, username: 'te' });

          expect(statusCode).toBe(400);
          expect(body.message).toBe('Username should be minimum 6 characters.');
        });
      });

      describe('if password is not provided', () => {
        it('should return 400', async () => {
          const { statusCode, body } = await supertest(app)
            .post(USER_SIGNUP_ROUTE)
            .send({
              email: userInput.email,
              passwordConfirmation: userInput.passwordConfirmation,
              username: userInput.username,
            });

          expect(statusCode).toBe(400);
          expect(body.message).toBe('Password is required.');
        });
      });

      describe('if password length is not enough', () => {
        it('should return 400', async () => {
          const { statusCode, body } = await supertest(app)
            .post(USER_SIGNUP_ROUTE)
            .send({ ...userInput, password: 'p' });

          expect(statusCode).toBe(400);
          expect(body.message).toBe('Password should be minimum 8 characters.');
        });
      });

      describe('if password length is too long', () => {
        it('should return 400', async () => {
          const { statusCode, body } = await supertest(app)
            .post(USER_SIGNUP_ROUTE)
            .send({ ...userInput, password: 'p'.repeat(69) });

          expect(statusCode).toBe(400);
          expect(body.message).toBe(
            'Password should be maximum 64 characters.'
          );
        });
      });
    });

    describe('database tests', () => {
      beforeAll(() => {
        initializeDb();
      });

      describe('successful user creation', () => {
        it('should return 201', async () => {
          const { statusCode, body } = await supertest(app)
            .post(USER_SIGNUP_ROUTE)
            .send(userInput);

          expect(statusCode).toBe(201);
          expect(body.message).toBe('User created.');
          expect(body.data.preference).toBe('opus');
          expect(body.data.token).not.toBeNull();
        });
      });

      describe('if user with same email exists', () => {
        it('should return 409, UniqueConstraintError', async () => {
          const { statusCode, body } = await supertest(app)
            .post(USER_SIGNUP_ROUTE)
            .send({ ...userInput, username: 'somediffusername' });

          expect(statusCode).toBe(409);
          expect(body).toMatchObject({
            message: 'User with given email already exists.',
          });
        });
      });

      describe('if user with same username exists', () => {
        it('should return 409, UniqueConstraintError', async () => {
          const { statusCode, body } = await supertest(app)
            .post(USER_SIGNUP_ROUTE)
            .send({ ...userInput, email: 'somediffusername@pm.me' });

          expect(statusCode).toBe(409);
          expect(body).toMatchObject({
            message: 'User with given username already exists.',
          });
        });
      });

      describe('email case sensitivity', () => {
        it('should return 409, UniqueConstraintError', async () => {
          const { statusCode, body } = await supertest(app)
            .post(USER_SIGNUP_ROUTE)
            .send({
              ...userInput,
              username: 'somediffusername',
              email: userInput.email.toUpperCase(),
            });

          expect(statusCode).toBe(409);
          expect(body).toMatchObject({
            message: 'User with given email already exists.',
          });
        });
      });

      describe('username case sensitivity', () => {
        it('should return 409, UniqueConstraintError', async () => {
          const { statusCode, body } = await supertest(app)
            .post(USER_SIGNUP_ROUTE)
            .send({
              ...userInput,
              username: userInput.username.toUpperCase(),
              email: 'somediffemail@pm.mee',
            });

          expect(statusCode).toBe(409);
          expect(body).toMatchObject({
            message: 'User with given username already exists.',
          });
        });
      });

      afterAll(async () => {
        await User.truncate();
      });
    });
  });

  describe('signin user', () => {
    describe('validator tests', () => {
      describe('if email is not provided', () => {
        it('should return 400', async () => {
          const { statusCode, body } = await supertest(app)
            .post(USER_SIGNIN_ROUTE)
            .send({ password: userSigninInput.password });

          expect(statusCode).toBe(400);
          expect(body.message).toBe('Email is required.');
        });
      });

      describe('if email is invalid', () => {
        it('should return 400', async () => {
          const { statusCode, body } = await supertest(app)
            .post(USER_SIGNIN_ROUTE)
            .send({ ...userSigninInput, email: 'invalidemail' });
          expect(statusCode).toBe(400);
          expect(body.message).toBe('Invalid email.');
        });
      });

      describe('if password is not provided', () => {
        it('should return 400', async () => {
          const { statusCode, body } = await supertest(app)
            .post(USER_SIGNIN_ROUTE)
            .send({ email: userSigninInput.email });

          expect(statusCode).toBe(400);
          expect(body.message).toBe('Password is required.');
        });
      });
    });

    describe('databse tests', () => {
      beforeAll(() => {
        initializeDb();
      });

      describe('if user with an account signs in successfully', () => {
        it('should return 200', async () => {
          await supertest(app).post(USER_SIGNUP_ROUTE).send(userInput);

          const { statusCode, body } = await supertest(app)
            .post(USER_SIGNIN_ROUTE)
            .send(userSigninInput);

          expect(statusCode).toBe(200);
          expect(body.token).not.toBeNull();
          expect(body.id).not.toBeNull();
          expect(body.preference).toBe('opus');
        });
      });

      describe("if user with given email doesn't exist", () => {
        it('should return 401', async () => {
          const WRONG_EMAIL = 'hahahah@pm.me';
          const { statusCode, body } = await supertest(app)
            .post(USER_SIGNIN_ROUTE)
            .send({ ...userSigninInput, email: WRONG_EMAIL });

          expect(statusCode).toBe(401);
          expect(body.message).toBe(`Invalid credentials.`);
        });
      });

      describe("if password doesn't match", () => {
        it('should return 401', async () => {
          const { statusCode, body } = await supertest(app)
            .post(USER_SIGNIN_ROUTE)
            .send({ ...userSigninInput, password: 'olololololo' });
          expect(statusCode).toBe(401);
          expect(body.message).toBe(`Invalid credentials.`);
        });
      });

      afterAll(async () => {
        await User.truncate();
      });
    });
  });
});
