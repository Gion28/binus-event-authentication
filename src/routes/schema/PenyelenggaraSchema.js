import Joi from 'joi';

export const CreatePenyelenggaraSchema = Joi.object({
  penyelenggaraId: Joi.string().allow('', null).optional(),
  organizationName: Joi.string().min(4).required().messages({
    'string.base': 'Name should be a type of text!',
    'string.empty': 'Name cannot be an empty field!',
    'string.min': 'Name should have at least 4 characters!',
    'any.required': 'Name is a required field!'
  }),
  email: Joi.string().email().min(12).required()
    .messages({
      'string.base': 'Email should be a type of text!',
      'string.empty': 'Email cannot be an empty field!',
      'string.min': 'Email should have at least 10 characters!',
      'any.required': 'Email is a required field!'
    }),
  phoneNo: Joi.string().min(10).max(13).required()
    .messages({
      'string.empty': 'Phone Number cannot be an empty field!',
      'string.min': 'Phone Number should have at least 10 characters!',
      'string.max': 'Phone Number should have at most 13 characters!',
      'any.required': 'Phone Number is a required field!'
    }),
  logo: Joi.binary().allow('', null).optional(),
  organizationType: Joi.string().required().valid('Himpunan', 'UKM', 'Binus'),
  password: Joi.string().min(6).required().messages({
    'string.base': 'Password should be a type of text!',
    'string.empty': 'Password cannot be an empty field!',
    'string.min': 'Password should have at least 6 characters!',
    'any.required': 'Password is a required field!'
  })
});

export const EditPenyelenggaraSchema = Joi.object({
  penyelenggaraId: Joi.string().allow('', null).optional(),
  email: Joi.string().email().min(12).required()
    .messages({
      'string.base': 'Email should be a type of text!',
      'string.empty': 'Email cannot be an empty field!',
      'string.min': 'Email should have at least 10 characters!',
      'any.required': 'Email is a required field!'
    }),
  phoneNo: Joi.string().min(10).max(13).required()
    .messages({
      'string.empty': 'Phone Number cannot be an empty field!',
      'string.min': 'Phone Number should have at least 10 characters!',
      'string.max': 'Phone Number should have at most 13 characters!',
      'any.required': 'Phone Number is a required field!'
    }),
  logo: Joi.binary().allow('', null).optional(),
  organizationType: Joi.string().required().valid('Himpunan', 'UKM', 'Binus')
});
