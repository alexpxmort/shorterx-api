import { celebrate, Joi, Segments } from 'celebrate';

const emailRegex = new RegExp(
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
);

export const joiSignInSchema = Joi.object().keys({
  email: Joi.string().required().regex(emailRegex),
  password: Joi.string().required().min(6)
});

export const joiCreateUserSchema = Joi.object().keys({
  email: Joi.string().required().regex(emailRegex),
  name: Joi.string().required(),
  password: Joi.string().required().min(6)
});

export const signInSchema = celebrate({ [Segments.BODY]: joiSignInSchema });

export const userCreateSchema = celebrate({
  [Segments.BODY]: joiCreateUserSchema
});
