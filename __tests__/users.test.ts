import supertest from 'supertest';
import app from '../app';
import * as UsersController from '../components/users/usersController';

const USER_SIGNUP_ROUTE = '/api/users/signup';

const userInput = {
  email: 'test123456@pm.me',
  password: 'test123456',
  passwordConfirmation: 'test123456',
  username: 'test123456',
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
    });
  });
});
