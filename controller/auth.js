import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createError } from '../utils/error.js';

export const signup = async (req, res, next) => {
    try {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hash });
        await newUser.save();
        const { password, ...others } = newUser._doc;

        // Create JWT Token
        const token = jwt.sign(
            {
                id: newUser._id
            },
            process.env.JWT
            // { expiresIn: '1h' }
        );

        // Send Cookie
        res.cookie('access_token', token, {
            httpOnly: true
        })
            .status(200)
            .json({ user: others, accToken: token });
    } catch (err) {
        next(err);
    }
};

export const signin = async (req, res, next) => {
    try {
        const findEmail = await User.findOne({ email: req.body.email });
        if (!findEmail) {
            return next(createError(404, 'No such User!'));
        }

        const { password, ...others } = findEmail._doc;

        const checkPass = await bcrypt.compare(
            req.body.password,
            findEmail.password
        );
        if (!checkPass) {
            return next(createError(400, 'Wrong Credentials!'));
        }

        // Create JWT Token
        const token = jwt.sign(
            {
                id: findEmail._id
            },
            process.env.JWT
            // { expiresIn: '1h' }
        );

        // Send Cookie
        res.cookie('access_token', token, {
            httpOnly: true
        })
            .status(200)
            .json({ user: others, accToken: token });
    } catch (err) {
        next(err);
    }
};

export const signinGoogle = async (req, res, next) => {
    try {
        const findEmail = await User.findOne({ email: req.body.email });
        if (!findEmail) {
            const newUser = new User({ ...req.body, fromGoogle: true });
            await newUser.save();
            // Create JWT Token
            const token = jwt.sign(
                {
                    id: newUser._id
                },
                process.env.JWT
                // { expiresIn: '1h' }
            );

            // Send Cookie
            res.cookie('access_token', token, {
                httpOnly: true
            })
                .status(200)
                .json({ user: newUser._doc, accToken: token });
        }

        // Create JWT Token
        const token = jwt.sign(
            {
                id: findEmail._id
            },
            process.env.JWT
            // { expiresIn: '1h' }
        );

        // Send Cookie
        res.cookie('access_token', token, {
            httpOnly: true
        })
            .status(200)
            .json({ user: findEmail._doc, accToken: token });
    } catch (err) {
        next(err);
    }
};
