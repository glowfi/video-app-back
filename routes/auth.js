import express from 'express';
import { signup, signin, signinGoogle } from '../controller/auth.js';

const router = express.Router();

// Create User
router.post('/signup', signup);

// Sign in
router.post('/signin', signin);

// GAuth
router.post('/google', signinGoogle);


export default router;
