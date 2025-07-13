import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";

const verifyDoctor = async(req, res, next) => {

    try {
        const id = req.user.userId;
        const user = await User.findById(id);

        console.log(user)


        if (!user?.isDoctor) {
            return next(new ErrorResponse("middleware.not_doctor", 403));
        }

        if (!user.approved) {
          return next(new ErrorResponse("middleware.not_approved_doctor", 403));
        }
        
    } catch (error) {
        next(error);
        
    }
  next();
}
export default verifyDoctor;