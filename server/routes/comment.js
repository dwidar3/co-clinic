import {Router} from 'express';
const router = Router();
import verifyToken  from '../utils/verifyUser.js';
import {
    createComment,
    deleteComment,
    editComment,
    getPostComments,
    getcomments,
    likeComment,
} from "../controllers/comment.js"

router.post('/create', verifyToken, createComment);
router.get('/getPostComments/:postId', getPostComments);
router.put('/like/:id', verifyToken, likeComment);
router.put('/edit/:id', verifyToken, editComment);
router.delete('/delete/:id', verifyToken, deleteComment);
router.get('/get', verifyToken, getcomments);

export default router;
