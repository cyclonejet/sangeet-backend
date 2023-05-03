import express from 'express';
import { signup } from './usersController';
import { validate } from '../../middleware/validate';
import { createUsersSchema } from './usersSchema';

const router = express.Router();

router.post('/signup', validate(createUsersSchema), signup);

export default router;
