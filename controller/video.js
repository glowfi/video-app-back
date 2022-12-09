import User from '../models/User.js';
import Video from '../models/Video.js';
import { createError } from '../utils/error.js';

export const addVideo = async (req, res, next) => {
    const newVideo = new Video({ userId: req.info.id, ...req.body });
    try {
        const savedVideo = await newVideo.save();
        res.status(200).json(savedVideo);
    } catch (err) {
        next(err);
    }
};
export const updVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return next(createError(404, 'Video does not exists!'));
        }

        if (video.userId == req.info.id) {
            const updatedVideo = await Video.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body
                },
                { new: true }
            );
            return res.status(200).json(updatedVideo);
        } else {
            return next(createError(403, 'You can update only ur videos!'));
        }
    } catch (err) {
        next(err);
    }
};
export const delVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return next(createError(404, 'Video does not exists!'));
        }

        if (video.userId == req.info.id) {
            await Video.findOneAndDelete(req.params.id);
            return res.status(200).json('Video deleted!');
        } else {
            return next(createError(403, 'You can delete only ur videos!'));
        }
    } catch (err) {
        next(err);
    }
};
export const getVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return next(createError(404, 'Video does not exists!'));
        }
        return res.status(200).json(video);
    } catch (err) {
        next(err);
    }
};

export const addViews = async (req, res, next) => {
    try {
        await Video.findOneAndUpdate(req.params.id, {
            $inc: { views: 1 }
        });
        return res.status(200).json('Views has been increased');
    } catch (err) {
        next(err);
    }
};
export const getTrending = async (req, res, next) => {
    try {
        const videos = await Video.find().sort({ views: -1 });
        return res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};
export const getRandom = async (req, res, next) => {
    try {
        const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
        return res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};
export const getSub = async (req, res, next) => {
    try {
        const gets = await User.findById(req.info.id);
        const subChannel = gets.subscibedUsers;
        const list = await Promise.all(
            subChannel.map((cid) => {
                return Video.find({ userId: cid });
            })
        );

        return res
            .status(200)
            .json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
    } catch (err) {
        next(err);
    }
};

export const getTags = async (req, res, next) => {
    const tags = req.query.tags.split(',');
    try {
        const videos = await Video.find({ tags: { $in: tags } }).limit(20);
        return res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};

export const getSearch = async (req, res, next) => {
    const query = req.query.q;
    try {
        const videos = await Video.find({
            title: { $regex: query, $options: 'i' }
        }).limit(20);
        return res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};
