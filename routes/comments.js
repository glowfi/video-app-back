import express from 'express';
import { getComm, delComm, updComm, addComm } from '../controller/comment.js';
import {verifyToken} from '../utils/verifyToken.js'
const router = express.Router();

router.get('/:id', getComm);
router.post('/:id', verifyToken, addComm);
router.put('/:id', verifyToken, updComm);
router.delete('/:id', verifyToken, delComm);

export default router;
