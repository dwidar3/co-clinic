import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";

const verifyAdmin = async(req, res, next) => {

    try {
        const id = req.user.userId;  
        const user = await User.findById(id);

        if (!user) {
          if (user?.isAdmin != true) {
            return next(new ErrorResponse("middleware.user_not_found", 404));
          }
        }


        console.log("user in admin middleware ===> ", user)

        
        if (user?.isAdmin != true) {
            return next(new ErrorResponse("middleware.not_admin", 403));
          }

        if (!user?.approved) {
          return next(new ErrorResponse("middleware.not_approved_admin", 403));
        }
    } catch (error) {
        next(error);
        
    }
  next();
}
export default verifyAdmin;