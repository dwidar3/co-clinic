
import {Router} from 'express'
import { toggleApprove, getUnapprovedUsers } from '../controllers/admin.js'
import verifyToken  from '../utils/verifyUser.js';
import verifyAdmin from '../middleware/adminMiddleware.js';

const router = Router()

router.get('/get-unapproved', verifyToken, verifyAdmin, getUnapprovedUsers);
router.patch('/toggle-approve/:userId', verifyToken, verifyAdmin, toggleApprove);


export default router

