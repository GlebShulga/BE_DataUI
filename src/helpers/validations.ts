import Joi from "joi";
import { Types } from "mongoose";

const objectId = Joi.string().custom((value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
});

export const updateCartSchema = Joi.object({
  user: objectId.required(),
  isDeleted: Joi.boolean().required(),
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.object({
          _id: objectId.required(),
          title: Joi.string().required(),
          description: Joi.string().required(),
          price: Joi.number().required(),
        }).required(),
        count: Joi.number().integer().required(),
      })
    )
    .required(),
});
