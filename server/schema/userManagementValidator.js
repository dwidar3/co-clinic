import Joi from 'joi';
import ErrorResponse from "../utils/errorResponse.js";
const schemas = {


    updateUser: Joi.object({
        name: Joi.string().min(3).max(30),
        email: Joi.string().email(),
        profileImage: Joi.string()
    }),

    getUsers: Joi.object({
        startIndex: Joi.number(),
        limit: Joi.number()
            .max(100),
        sort: Joi.string().valid("asc", "desc")
    }),

    idOnly: Joi.object({
            userId: Joi.string().max(150).required()
    }),
};

const userManagemntValidator = (schemaName, body) => {
    const { error } = schemas[schemaName].validate(body);
    if (error) {
        // console.log(error)
        return new ErrorResponse(error.details[0].message, 400, )
    };
    return true;
};

export default userManagemntValidator;
