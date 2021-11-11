import express from 'express';
import { signup, activateAccount,login } from '../controllers/auth.js';

const authRouter = express.Router();

authRouter.post('/signup',signup);
authRouter.post('/email-activate',activateAccount);
authRouter.post('/login',login);
export default authRouter;
