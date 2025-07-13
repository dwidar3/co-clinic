import jwt from 'jsonwebtoken'
const generateJWT =  (payload, time) => {
    const token =  jwt.sign(payload, process.env.
        JWT_SECRET, { expiresIn: `${time}` })
    return token;
}

export default generateJWT
