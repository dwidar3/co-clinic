import Joi from 'joi';
import ErrorResponse from "../utils/errorResponse.js";

const schemas = {

    create: Joi.object({
        content: Joi.string().min(5).max(300).required(),
        postId: Joi.string().max(100).required(),
        userId: Joi.string().max(100),
    }
),

    getPostComments: Joi.object({
            startIndex: Joi.number(),
            limit: Joi.number().max(100),
        }),
    
};  

const commentManagementValidator = (schemaName, body) => {
    const { error } = schemas[schemaName].validate(body);
    if (error) {
        // console.log(error)
        return new ErrorResponse(error.details[0].message, 400, )
    };
    return true;
};

export default commentManagementValidator;