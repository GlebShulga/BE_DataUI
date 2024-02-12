import { v4 as uuidv4 } from "uuid";

export async function createOrUpdatePromotion(
  Model: any,
  savedPromo: any,
  pmmId: string,
) {
  let promotion = await Model.findOne({ pmmId });
  let originalEnabled;

  if (!promotion) {
    savedPromo.pmmId = uuidv4();
    promotion = new Model(savedPromo);
  } else {
    originalEnabled = promotion.enabled;
    promotion.set(savedPromo);
  }

  return { promotion, originalEnabled };
}
