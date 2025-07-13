import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import PneumoniaScan from "../models/PneumoniaScan.js";
import cloudinary from "cloudinary";
import catchAsync from "../utils/catchAsync.js";
import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const handlePneumoniaScan = catchAsync(async (req, res, next) => {
  const userId = req?.user?.userId;

  if (!req?.file) {
    return next(new ErrorResponse("Image file is required", 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  const buffer = req.file.buffer;
  const originalName = req.file.originalname;

  console.log("before base46");

  // 1. Upload to Cloudinary using base64 buffer
  const base64 = `data:${req.file.mimetype};base64,${buffer.toString(
    "base64"
  )}`;

  console.log("before cloudinaryResult");

  const cloudinaryResult = await cloudinary.v2.uploader.upload(base64, {
    folder: "pneumonia-scans",
    public_id: originalName.split(".")[0],
  });

  // 2. Send to ML model using buffer (FormData)

  console.log("before formData");
  const formData = new FormData();
  formData.append("file", buffer, {
    filename: originalName,
    contentType: req.file.mimetype,
  });

  console.log("before predictionResult");

  const { data: predictionResult } = await axios.post(
    `https://7700495927e2.ngrok-free.app/predict`,
    formData,
    { headers: formData.getHeaders() }
  );

  console.log("predictionResult ===> ", predictionResult);
  // 3. Save to MongoDB
  const newScan = await PneumoniaScan.create({
    userId,
    imageUrl: cloudinaryResult.secure_url,
    prediction: predictionResult.prediction,
  });

  res.status(200).json({
    message: "Scan successful",
    result: predictionResult.prediction,
    scan: newScan,
  });
});

export const getUserScans = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  // 🔒 Validate user existence
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  const scans = await PneumoniaScan.find({ userId }).sort({ createdAt: -1 });

  res.status(200).json({
    count: scans.length,
    scans,
  });
});
