import { Router } from 'express';
import { askChatbot, clearChatbotLog, getUserChats } from '../controllers/selfChatbot.js';
import verifyToken from '../utils/verifyUser.js';

const router = Router();

router.post('/ask', verifyToken, askChatbot);
router.get('/chats', verifyToken, getUserChats);
router.delete('/delete-log', verifyToken, clearChatbotLog); // 🆕 Clear chat history


export default router;
