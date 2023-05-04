import express from 'express';
import { signin, signup } from './usersController';
import { validate } from '../../middleware/validate';
import { createUsersSchema, signinUserSchema } from './usersSchema';

const router = express.Router();

router.post('/signup', validate(createUsersSchema), signup);
router.post('/signin', validate(signinUserSchema), signin);

export default router;
