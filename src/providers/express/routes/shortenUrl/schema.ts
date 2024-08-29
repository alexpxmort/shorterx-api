import { celebrate, Joi, Segments } from 'celebrate';

export const joiCreateShortUrlSchema = Joi.object().keys({
  originalUrl: Joi.string().required(),
  clickCount: Joi.number().optional().default(0)
});

export const createShortUrlSchema = celebrate({
  [Segments.BODY]: joiCreateShortUrlSchema
});
