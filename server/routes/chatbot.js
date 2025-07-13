// routes/book.js
import express from 'express';
import verifyToken from '../utils/verifyUser.js';
import upload from '../config/upload.js';
import { chatWithGemini, getChatMessages} from '../controllers/chatbot.js';

const router = express.Router();

router.post('/create', verifyToken, chatWithGemini);

router.get('/chat/:chatHistoryId', verifyToken, getChatMessages);

export default router;