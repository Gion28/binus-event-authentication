import Joi from 'joi';

export const PenyelenggaraSchema = Joi.object({
  penyelenggaraId: Joi.string().allow('', null).optional(),
  name: Joi.string().required(),
  email: Joi.string().required(),
  phoneNo: Joi.string().required(),
  image: Joi.binary().allow('', null).optional(),
  encrypt_password: Joi.string().required()
});
