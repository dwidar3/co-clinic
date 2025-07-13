import {Router} from 'express'
import multer from 'multer';
import { handlePneumoniaScan, getUserScans } from '../controllers/pneumonia.js';
import verifyToken from '../utils/verifyUser.js';

const router = Router();

const upload = multer({ storage: multer.memoryStorage() }); // IN-MEMORY BUFFER


router.post('/scan', verifyToken, upload.single('file'), handlePneumoniaScan);

router.get('/scans', verifyToken, getUserScans)

export default router;
