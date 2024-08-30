import { celebrate, Joi, Segments } from 'celebrate';

export const joiCreateShortUrlSchema = Joi.object().keys({
  originalUrl: Joi.string().required()
});

export const createShortUrlSchema = celebrate({
  [Segments.BODY]: joiCreateShortUrlSchema
});
