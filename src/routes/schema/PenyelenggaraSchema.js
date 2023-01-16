import Joi from 'joi';

export const CreatePenyelenggaraSchema = Joi.object({
  penyelenggaraId: Joi.string().allow('', null).optional(),
  name: Joi.string().required(),
  email: Joi.string().required(),
  phoneNo: Joi.string().required(),
  image: Joi.binary().allow('', null).optional(),
  password: Joi.string().required()
});

export const EditPenyelenggaraSchema = Joi.object({
  penyelenggaraId: Joi.string().allow('', null).optional(),
  name: Joi.string().required(),
  email: Joi.string().required(),
  phoneNo: Joi.string().required(),
  image: Joi.binary().allow('', null).optional()
});
