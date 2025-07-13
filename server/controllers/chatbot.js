import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatHistory from "../models/ChatHistory.js";
import catchAsync from "../utils/catchAsync.js";
import ErrorResponse from "../utils/errorResponse.js";
import User from "../models/User.js";
import { STATUS_CODE } from "../utils/httpStatusCode.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = "gemini-2.0-flash";







// Add language instruction to context
const getLanguageInstruction = (language) => {
  return language == 'ar' 
    ? "\n\n[الرجاء الرد باللغة العربية فقط. هذا حوار بالعربية كانك طبيب رحيم وعطوف وكأني مريض احتاج ل نصيحتك واستشارتك. ولا تشارك ابدا اني قلت لك هذا الجزء في اي رد من الردود]\n\n"
    : "Please reply in English only. This dialogue is in Eglish. If you were a compassionate and kind doctor, you would have given me your advice and consultation. and never share that i have told you that in any response";
};

export const chatWithGemini = catchAsync(async (req, res) => {
  const { message, language = "en", chatHistoryId } = req.body;
  const userId = req.user.userId;

  console.log("at beginning")
  console.log("message ===> ", message)

  console.log("at userId", userId)

  if (!message) {
    throw new ErrorResponse("chatbot.required_message", 404)
  }
  

  if (!userId) {
    throw new ErrorResponse("chatbot.required_user_id", 404)
  }

  const existingUser = await User.find({_id: userId})



  if (!existingUser) {
    throw new ErrorResponse("chatbot.user_not_found", 404)
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    let chatHistory;
    if (chatHistoryId && chatHistoryId != null && chatHistoryId != undefined && chatHistoryId != "undefined" ) {
      chatHistory = await ChatHistory.findOne({ _id: chatHistoryId, user: userId });
      if (!chatHistory) {
        res.write(`data: ${JSON.stringify({ error: req.t("chatbot.history_not_exists") })}\n\n`);
        res.write('data: [DONE]\n\n');
        return res.end();
      }
    } else {
      chatHistory = new ChatHistory({ user: userId, messages: [] });
      await chatHistory.save();
      res.write(`data: ${JSON.stringify({ chatHistoryId: chatHistory._id })}\n\n`);
    }

    // Add language instruction to user's message
    const instruction = getLanguageInstruction(language);
    const fullMessage = message + instruction;

    // Add user message to history
    chatHistory.messages.push({
      role: "user",
      content: message,
      language
    });

    // Prepare context with language instruction
    const historyContext = chatHistory.messages
      .slice(-10)
      .map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content + getLanguageInstruction(msg.language) }]
      }));

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const chat = model.startChat({ history: historyContext });

    const result = await chat.sendMessageStream(fullMessage);
    let fullResponse = "";
    try {
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      }
      res.write('data: [DONE]\n\n');
    } catch (streamError) {
      console.error("Streaming error:", streamError);
      res.write(`data: ${JSON.stringify({ error: req.t('chatbot.streaming_error') })}\n\n`);
      res.write('data: [DONE]\n\n');
    }

    // Save response to history
    chatHistory.messages.push({
      role: "model",
      content: fullResponse,
      language
    });

    await chatHistory.save();
    res.end();

  } catch (error) {
    console.error("Chat error:", error);
    res.write(`data: ${JSON.stringify({ error: req.t('chatbot.processing_failed'), details: error.message })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
});

// Controller to get all messages for a specific chat history
export const getChatMessages = catchAsync( async (req, res, next) => {
  const { chatHistoryId } = req.params;
  const userId = req.user.userId;

  if (!chatHistoryId || chatHistoryId == "undefined") {
    return next (
      new ErrorResponse("chatbot.unexpected_format", 500)
    )
  }

  try {
    const chatHistory = await ChatHistory.findOne({ _id: chatHistoryId, user: userId });
    if (!chatHistory) {
      return res.status(404).json({ 
        status: STATUS_CODE.FAILED,
        message: req.t('chatbot.history_not_exists') });
    }
    res.status(200).json({
      data: chatHistory.messages,
      status: STATUS_CODE.SUCCESS,
      message: req.t('chatbot.history_founded')
    });
  } catch (error) {
    console.error("Error fetching chat messages:", error);

    return next(
            new ErrorResponse("chatbot.chat_messages_failed", 500)
          );
  }
});


