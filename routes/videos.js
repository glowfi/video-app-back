import express from 'express';
import {
    addVideo,
    delVideo,
    getVideo,
    updVideo,
    getSub,
    getRandom,
    getTrending,
    addViews, 
    getSearch,
    getTags
} from '../controller/video.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

// create video
router.post('/', verifyToken, addVideo);

// update video
router.put('/:id', verifyToken, updVideo);

// delete video
router.delete('/:id', verifyToken, delVideo);

// get video
router.get('/find/:id', getVideo);

// Add views
router.put('/views/:id', addViews);

// Different Videos
router.get('/trend', getTrending);
router.get('/random', getRandom);
router.get('/subscribed', verifyToken, getSub);
router.get('/tags', getTags);
router.get('/search', getSearch);

export default router;
