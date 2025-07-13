import Joi from 'joi';
import ErrorResponse from "../utils/errorResponse.js";
const schemas = {

    createAppointment: Joi.object({
        doctorId: Joi.string().required(),
        start: Joi.string().isoDate().required(),
        notes: Joi.string().max(700)
    }),

    getAppointments: Joi.object({
        page: Joi.number(),
        limit: Joi.number(),
        status: Joi.string().allow('pending','confirmed','cancelled','completed'),
        start: Joi.date(),
        end: Joi.date(),
        appointmentId: Joi.string()
        
    }),

    updateStatus: Joi.object({
        status: Joi.string().allow('pending','confirmed','cancelled','completed').required()
        }),

    
    
};  

const appointmentValidator = (schemaName, body) => {
    const { error } = schemas[schemaName].validate(body);
    if (error) {
        // console.log(error)
        return new ErrorResponse(error.details[0].message, 400, )
    };
    return true;
};

export default appointmentValidator;
