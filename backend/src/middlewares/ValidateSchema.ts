import Joi, { ObjectSchema } from "joi";
import { NextFunction, Response, Request } from "express";
import { IProfile } from "../models/Profile";

export const validateSchema = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      console.log(error);
      return res.status(422).json({ error });
    }
  };
};

export const Schemas = {
  profile: {
    create: Joi.object<IProfile>({
      picUrl: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string()
        .regex(/[\w]+@[\w]+\.[\w]+/)
        .required(),
      phone: Joi.string()
        .regex(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/)
        .required(),
    }),
    update: Joi.object<IProfile>({
      picUrl: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string()
        .regex(/[\w]+@[\w]+\.[\w]+/)
        .required(),
      phone: Joi.string()
        .regex(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/)
        .required(),
    }),
  },
};
