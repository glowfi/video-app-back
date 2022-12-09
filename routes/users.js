import express from 'express';
import {
    updateUser,
    deleteUser,
    getUser,
    subUser,
    unsubUser,
    likeVideo,
    unlikeVideo
} from '../controller/user.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

//update user
router.put('/:id', verifyToken, updateUser);

//delete user
router.delete('/:id', verifyToken, deleteUser);

//get user
router.get('/find/:id', getUser);

//Subscribe user
router.put('/sub/:id', verifyToken, subUser);

//Unsubscribe user
router.put('/unsub/:id', verifyToken, unsubUser);

//Like video
router.put('/like/:videoId', verifyToken, likeVideo);

//Unlike video
router.put('/dislike/:videoId',verifyToken, unlikeVideo);

export default router;
