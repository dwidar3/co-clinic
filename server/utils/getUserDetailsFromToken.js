import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const getUserDetailsFromToken = async(token)=>{
    
    if(!token){
        return {
            message : "session out",
            logout : true,
        }
    }

    const decode =  jwt.verify(token, process.env.JWT_SECRET)

    console.log("decoded from get User Details From Token =====> ", decode)


    const user = await User.findById(decode.userId).select('-password').lean()

    


    return user
}

export default getUserDetailsFromToken