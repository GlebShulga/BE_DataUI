import { Document } from "mongoose";
import { LocalizedDescription } from "./commonTypes";

export interface AmazonPrice {
  id: number;
  productId: string;
  eventId: number;
  level: number;
  eventDescription: string;
  value: number;
  effectiveFrom: Date | string;
  effectiveTo: Date | string;
  typePriority: number;
  typeName: string;
  status: string;
  temporary: boolean;
  localizedDescriptions: LocalizedDescription[];
  onlineOnly: boolean;
  romanceCopyApproved: boolean;
  productName: string;
}

export interface AmazonPriceDocument extends AmazonPrice, Document {
  id: number;
}
