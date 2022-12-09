import User from '../models/User.js';
import Video from '../models/Video.js';
import { createError } from '../utils/error.js';

export const updateUser = async (req, res, next) => {
    if (req.params.id === req.info.id) {
        try {
            const updateUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body
                },
                { new: true }
            );
            const { password, ...others } = updateUser._doc;
            res.status(200).json(others);
        } catch (err) {
            return next(err);
        }
    } else {
        return next(createError(403, 'You can update only your account'));
    }
};

export const deleteUser = async (req, res, next) => {
    if (req.params.id === req.info.id) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json('User has been deleted!');
        } catch (err) {
            return next(err);
        }
    } else {
        return next(createError(403, 'You can delete your account only!'));
    }
};

export const getUser = async (req, res, next) => {
    try {
        const findUser = await User.findById({ _id: req.params.id });
        if (!findUser) {
            return next(createError(404, 'User not found!'));
        }
        const { password, ...others } = findUser._doc;
        return res.status(200).json(others);
    } catch (err) {
        next(err);
    }
};

// Fix
// export const subUser = async (req, res, next) => {
//     try {
//         const subbedUser = await User.findOne({ _id: req.info.id });
//         console.log(subbedUser);
//         if (subbedUser.subscibedUsers.indexOf(req.params.id) < 0) {
//             await User.findByIdAndUpdate(req.info.id, {
//                 $addToSet: { subscibedUsers: req.params.id }
//             });
//             await User.findByIdAndUpdate(
//                 { _id: req.params.id },
//                 {
//                     $inc: { subscibers: 1 }
//                 }
//             );
//             res.status(200).json('Subscribed!');
//         } else {
//             res.status(400).json('Already Subscribed!');
//         }
//     } catch (err) {
//         return next(err);
//     }
// };

// export const unsubUser = async (req, res, next) => {
//     try {
//         const subbedUser = await User.findOne({ _id: req.info.id });
//         console.log(subbedUser);
//         if (subbedUser.subscibedUsers.indexOf(req.params.id) >= 0) {
//             await User.findByIdAndUpdate(req.info.id, {
//                 $pull: { subscibedUsers: req.params.id }
//             });
//             await User.findByIdAndUpdate(
//                 { _id: req.params.id },
//                 {
//                     $inc: { subscibers: -1 }
//                 }
//             );
//             res.status(200).json('Unsubscribed!');
//         } else {
//             res.status(400).json('Already Unsubscribed!');
//         }
//     } catch (err) {
//         return next(err);
//     }
// };

export const subUser = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.info.id, {
            $push: { subscribedUsers: req.params.id }
        });
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: 1 }
        });
        res.status(200).json('Subscription successfull.');
    } catch (err) {
        next(err);
    }
};

export const unsubUser = async (req, res, next) => {
    try {
        try {
            await User.findByIdAndUpdate(req.info.id, {
                $pull: { subscribedUsers: req.params.id }
            });
            await User.findByIdAndUpdate(req.params.id, {
                $inc: { subscribers: -1 }
            });
            res.status(200).json('Unsubscription successfull.');
        } catch (err) {
            next(err);
        }
    } catch (err) {
        next(err);
    }
};

export const likeVideo = async (req, res, next) => {
    const id = req.info.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { likes: id },
            $pull: { dislikes: id }
        });
        res.status(200).json('The video has been liked.');
    } catch (err) {
        next(err);
    }
};

export const unlikeVideo = async (req, res, next) => {
    const id = req.info.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { dislikes: id },
            $pull: { likes: id }
        });
        res.status(200).json('The video has been disliked.');
    } catch (err) {
        next(err);
    }
};
