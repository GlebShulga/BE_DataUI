import Joi from "joi";

export const updateCartSchema = Joi.object({
  id: Joi.string().required(),
  userId: Joi.string().valid(Joi.ref("$userId")).required(),
  isDeleted: Joi.boolean().required(),
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.object({
          id: Joi.string().required(),
          title: Joi.string().required(),
          description: Joi.string().required(),
          price: Joi.number().required(),
        }).required(),
        count: Joi.number().integer().min(1).required(),
      })
    )
    .required(),
});
