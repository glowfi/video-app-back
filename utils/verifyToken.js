import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    console.log(token)
    if (!token) {
        return next(createError(401, 'Not Authenticated!'));
    }
    jwt.verify(token, process.env.JWT, (err, valid) => {
        if (err) {
            return next(createError(403, 'Not Token not vaild!'));
        }
        req.info = valid;
        next();
    });
};
