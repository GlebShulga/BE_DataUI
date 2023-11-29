import { Document, Types } from "mongoose";
import { LocalizedDescription } from "./commonTypes";

type PriceEventIdType = number | string;

interface IPriceEventId extends Types.Subdocument {
  value: PriceEventIdType;
  toString: () => string;
  toNumber: () => number;
}

export interface IHerbPrice {
  priceEventId: IPriceEventId;
  priceEventDescription: string;
  priceTypeDto: string;
  effectiveFrom: Date;
  effectiveTo: Date;
  descriptions: LocalizedDescription[];
  modified: string | null;
}

export interface IHerbPriceDocument extends IHerbPrice, Document {}
