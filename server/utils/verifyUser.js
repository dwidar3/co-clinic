import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ErrorResponse from "./errorResponse.js";
dotenv.config()

const verifyToken = async (req, res, next) => {

  



  const token = req?.cookies["token"] || "";





  if (!token) {
    
    return next(new ErrorResponse("No token, authorization denied",401 ));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
      

    req.user = decoded;

    console.log('user in verify user middlerware  ====> ', decoded )


    return next();
  } catch (err) {
    return next(new ErrorResponse("Forbidden",403 ));
  }
};

export default verifyToken;

