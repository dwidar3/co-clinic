import axios from "axios";
import catchAsync from "../utils/catchAsync.js";
import ChatbotMessage from "../models/slefChatbotMessage.js";
import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
import {selfChatBot} from '../utils/urls.js'

export const askChatbot = catchAsync(async (req, res, next) => {
  const { question } = req.body;
  const userId = req.user?.userId;

  if (!question || typeof question !== "string" || question.trim() === "") {
    return next(new ErrorResponse("يرجى إدخال سؤال", 400));
  }

  // Validate user exists
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorResponse("المستخدم غير موجود", 404));
  }

  try {
    const { data } = await axios.post(
      `${selfChatBot}/predict`,
      {
        question,
      }
    );

    console.log("data from ask ===> ", data)

    if (!data?.response) {
      return next(new ErrorResponse("Error in response from chatbot", 500));
    }

    const savedChat = await ChatbotMessage.create({
      userId,
      question,
      response: data?.response,
    });

    res.status(200).json({
      response: {
        input: question,
        output: data?.response,
      },
      saved: savedChat,
    });
  } catch (err) {
    console.error("AI API Error:", err.message);
    return next(
      new ErrorResponse("تعذر الوصول إلى خادم الذكاء الاصطناعي", 502)
    );
  }
});

export const getUserChats = catchAsync(async (req, res, next) => {
  const userId = req.user.userId;

  // Validate user exists
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorResponse("المستخدم غير موجود", 404));
  }

  const data = await ChatbotMessage.find({ userId }).sort({ createdAt: -1 });

  res.status(200).json({
    count: data.length,
    data,
  });
});


export const clearChatbotLog = catchAsync(async (req, res, next) => {
  const userId = req.user?.userId;

  // Validate user existence
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorResponse("المستخدم غير موجود", 404));
  }

  // Delete all chatbot messages for this user
  await ChatbotMessage.deleteMany({ userId });

  res.status(200).json({
    status: "تم مسح سجل المحادثات بنجاح.",
  });
});



