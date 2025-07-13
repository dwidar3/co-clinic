import Joi from "joi";
import ErrorResponse from "../utils/errorResponse.js";
const schemas = {
  signup: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    gender: Joi.string().valid("male", "female").required(),
    name: Joi.string().min(3).max(30).required(),
    birthDate: Joi.date().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
    isDoctor: Joi.boolean(),
    isAdmin: Joi.boolean(),
    specialization: Joi.string()
      .min(3)
      .when("isDoctor", {
        is: true,
        then: Joi.required().messages({
          "any.required": "specialization is required for doctors",
        }),
        otherwise: Joi.forbidden(),
      }),

  }),

  verifyUser: Joi.object({
    email: Joi.string().email().required().max(90),
    confirmCode: Joi.number().required(),
  }),

  signin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
  }),

  reset_password_request: Joi.object({
    email: Joi.string().email().required(),
  }),

  reset_password_verify: Joi.object({
    email: Joi.string().email().required(),
    confirmCode: Joi.number().required(),
  }),

  reset_password: Joi.object({
    email: Joi.string().email().required(),
    confirmCode: Joi.number().required(),
    newPassword: Joi.string().min(8).max(30).required(),
  }),

  refreshToken: Joi.object({
    refreshToken: Joi.string().max(500),
  }),

  accessToken: Joi.object({
    Authorization: Joi.string().max(500),
    authorization: Joi.string().max(500),
  }),
};

const authRequestsValidator = (schemaName, body) => {
  const { error } = schemas[schemaName].validate(body);
  if (error) {
    // console.log(error)
    return new ErrorResponse(error.details[0].message, 400);
  }
  return true;
};

export default authRequestsValidator;
