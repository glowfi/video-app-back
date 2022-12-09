import Comment from '../models/Comment.js';
import { createError } from '../utils/error.js';

export const addComm = async (req, res, next) => {
    try {
        const comment = new Comment({
            userId: req.info.id,
            videoId: req.params.id,
            ...req.body
        }) 
        await comment.save()
        return res.status(200).json(comment);
    } catch (err) {
        next(err);
    }
};

export const getComm = async (req, res, next) => {
    try {
        const allComment = await Comment.find({ videoId: req.params.id }).sort({ createdAt: -1 });
        return res.status(200).json(allComment);
    } catch (err) {
        next(err);
    }
};

export const updComm = async (req, res, next) => {
    try {
        const findComm = await Comment.findById({ _id: req.params.id });
        if (findComm.userId === req.info.id) {
            const updComm = await Comment.findByIdAndUpdate(
                { _id: req.params.id },
                { $set: req.body },
                { new: true }
            );
            return res.status(200).json(updComm);
        } else {
            return next(createError(403, 'Can only update comments by you!'));
        }
    } catch (err) {
        next(err);
    }
};

export const delComm = async (req, res, next) => {
    try {
        const findComm = await Comment.findById({ _id: req.params.id });
        if (findComm.userId === req.info.id) {
            await Comment.findByIdAndDelete({ _id: req.params.id });
            return res.status(200).json('Comment Deleted');
        } else {
            return next(createError(403, 'Can only delete comments by you!'));
        }
    } catch (err) {
        next(err);
    }
};
