import Joi from 'joi';
import ErrorResponse from "../utils/errorResponse.js";
import { updateBook } from '../controllers/books.js';

// Define the base create schema
const createSchema = Joi.object({
    title: Joi.string().min(5).max(100).required(),
    author: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(2).max(2000).required(),
    regularPrice: Joi.number().required(),
    discountPrice: Joi.number().required(),
    offer: Joi.boolean().required(),
    imageUrls: Joi.array().items(Joi.string()).min(1),
    // userRef: Joi.string().required(),
    pdf: Joi.string()
}); 
    
// inherits craete schema but making all fields optional
const updateSchema = createSchema.fork(
    Object.keys(createSchema.describe().keys),
    (field) => field.optional()
).min(1);

const schemas = {

    create: createSchema,

    update: updateSchema,

    idOnly: Joi.object({
        id: Joi.string().max(150).required()
    }),

    getBooks: Joi.object({
        limit: Joi.number().max(100),
        startIndex: Joi.number(),
        offer: Joi.boolean(),
        searchTerm: Joi.string().max(50).allow('', ""),
        sort: Joi.string().max(20),
        order: Joi.string().valid("asc", "desc")
    }),
};

const bookManagemntValidator = (schemaName, body) => {
    const { error } = schemas[schemaName].validate(body);
    if (error) {
        return new ErrorResponse(error.details[0].message, 400);
    };
    return true;
};

export default bookManagemntValidator;
