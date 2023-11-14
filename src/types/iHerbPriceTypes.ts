import { Document } from "mongoose";
import { LocalizedDescription } from "./commonTypes";

export interface IHerbPrice {
  priceEventId: number;
  priceEventDescription: string;
  priceTypeDto: string;
  effectiveFrom: Date;
  effectiveTo: Date;
  descriptions: LocalizedDescription[];
  modified: string | null;
}

export interface IHerbPriceDocument extends IHerbPrice, Document {}
