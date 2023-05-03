import { object, string, TypeOf } from 'zod';

export const createUsersSchema = object({
  body: object({
    username: string({
      required_error: 'Username is required.',
    }).min(6, 'Username should be minimum 6 characters.'),
    password: string({
      required_error: 'Password is required.',
    }).min(8, 'Password should be minimum 8 characters.'),
    passwordConfirmation: string({
      required_error: 'Confirm password is required.',
    }),
    email: string({
      required_error: 'Email is required.',
    }).email('Invalid email.'),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match.',
    path: ['passwordConfirmation'],
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUsersSchema>,
  'body.passwordConfirmation'
>;
