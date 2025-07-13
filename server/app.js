import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import multer from "multer";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import path from "path";
import cookieParser from "cookie-parser";

import connectDB from "./config/connectDB.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import bookRoutes from "./routes/book.js";
import commentRoutes from "./routes/comment.js";
import appointmentRoutes from "./routes/appointment.js";
import adminRoutes from "./routes/admin.js";
import chatbotRoutes from "./routes/chatbot.js";
import pneumoniaRoutes from "./routes/pneumonia.js";
import selfChatbotRoutes from "./routes/selfChatbot.js";

// import aiChatRoutes from "./routes/aichat.js";
import {server, app} from './socket/index.js'
import errorHandler from "./middleware/errorHandler.js";
import { STATUS_CODE } from "./utils/httpStatusCode.js";

import {allowedOrigins} from './utils/urls.js'

// translate:----------




  // translate:----------

connectDB();
const PORT = process.env.PORT || 3000;


//// tranlsate ----------------------------



// translate




// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)



app.use(express.json());




app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true)
      
      if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    } else {
      return callback(new Error("Not Allowed by CORS"))
    } 
  },

  credentials : true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'x-language'], // optionally x-language

}))



app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())





//// translate -------------------------------



// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname); // Get the file extension
    cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Append the file extension
  }
});
// Initialize upload variable
const upload = multer({ storage: storage });

// Endpoint for uploading files
app.post('/api/upload', upload.array('images', 6), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'No files uploaded',
    });
  }

  const imageUrls = req.files.map(file => `${process.env.BASE_URL}/uploads/${file.filename}`);

  res.status(200).json({
    status: 'success',
    message: 'Images uploaded successfully',
    data: imageUrls,
  });
  } catch (error) {
    res.status(500).json({ staus: STATUS_CODE.FAILED, message: 'Failed to upload file' });
  }
});

// Define __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// Set static folder for profile images.
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));



app.use("/api/auth/users", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/pneumonia", pneumoniaRoutes)
app.use("/api/self-chatbot", selfChatbotRoutes);

// app.use("/api/aichats", aiChatRoutes);


const fakeToken = "pla pla pla"

app.get('', async(req, res) => {
  res.json("hello world")
})

app.get('ali', async (req, res) => {
  res.cookie("fakeToken", fakeToken, {

        httpOnly: true,
  secure: true,         // Important for HTTPS & cross-site
  sameSite: 'None',     // Required for cross-site cookies
        maxAge: 30 * 24 * 60 * 60 * 1000, // Expires in 30 days
      })

      .status(200)

      .json({
        "check": "Check it"
      })
})

app.all("*", (req, res) => {
  res.status(404).json({ status: "error", message: req.t('server.not_available') })
})

app.use(errorHandler);


server.listen(PORT, () => {
  console.log("Server is running on port " + PORT );
});


export default app; // ES modules export