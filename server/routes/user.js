import {Router} from 'express'
import { deleteUser, getUser, getUsers, searchUser, test, updateUser, userDetails } from '../controllers/user.js'
import upload from "../config/multer.js";
import verifyToken  from '../utils/verifyUser.js';

const router = Router()

router.post('/update/:id',verifyToken, upload, updateUser); 
router.post("/search-user",searchUser)

router.get('/getusers', verifyToken, getUsers);
router.get("/user-details", verifyToken, userDetails)
router.get('/:userId', verifyToken, getUser)

router.delete('/delete/:id', verifyToken, deleteUser)

export default router