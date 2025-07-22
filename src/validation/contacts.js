import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': `"name" must be a string`,
    'string.empty': `"name" cannot be empty`,
    'string.min': `"name" must be at least 3 characters long`,
    'string.max': `"name" must be at most 20 characters long`,
    'any.required': `"name" is a required field`,
  }),

  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.base': `"phoneNumber" must be a string`,
    'string.empty': `"phoneNumber" cannot be empty`,
    'string.min': `"phoneNumber" must be at least 3 characters long`,
    'string.max': `"phoneNumber" must be at most 20 characters long`,
    'any.required': `"phoneNumber" is a required field`,
  }),

  email: Joi.string().email().min(3).max(20).allow(null, '').messages({
    'string.email': `"email" must be a valid email address`,
    'string.min': `"email" must be at least 3 characters long`,
    'string.max': `"email" must be at most 20 characters long`,
  }),

  isFavourite: Joi.boolean().default(false),

  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'any.only': `"contactType" must be one of: 'work', 'home', 'personal'`,
      'any.required': `"contactType" is a required field`,
    }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': `"name" must be a string`,
    'string.empty': `"name" cannot be empty`,
    'string.min': `"name" must be at least 3 characters long`,
    'string.max': `"name" must be at most 20 characters long`,
  }),

  phoneNumber: Joi.string().min(3).max(20).messages({
    'string.base': `"phoneNumber" must be a string`,
    'string.empty': `"phoneNumber" cannot be empty`,
    'string.min': `"phoneNumber" must be at least 3 characters long`,
    'string.max': `"phoneNumber" must be at most 20 characters long`,
  }),

  email: Joi.string().email().min(3).max(20).allow(null, '').messages({
    'string.email': `"email" must be a valid email address`,
    'string.min': `"email" must be at least 3 characters long`,
    'string.max': `"email" must be at most 20 characters long`,
  }),

  isFavourite: Joi.boolean(),

  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'any.only': `"contactType" must be one of: 'work', 'home', 'personal'`,
  }),
})
  .min(1)
  .messages({
    'object.min': `At least one field must be provided to update the contact`,
  });
