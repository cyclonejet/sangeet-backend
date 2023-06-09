import { object, string, TypeOf } from 'zod';

export const createUsersSchema = object({
  body: object({
    username: string({
      required_error: 'Username is required.',
    }).min(6, 'Username should be minimum 6 characters.'),
    password: string({
      required_error: 'Password is required.',
    })
      .min(8, 'Password should be minimum 8 characters.')
      .max(64, 'Password should be maximum 64 characters.'),
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

export const signinUserSchema = object({
  body: object({
    email: string({
      required_error: 'Email is required.',
    }).email('Invalid email.'),
    password: string({ required_error: 'Password is required.' }),
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUsersSchema>,
  'body.passwordConfirmation'
>;

export type SigninUserInput = TypeOf<typeof signinUserSchema>;
