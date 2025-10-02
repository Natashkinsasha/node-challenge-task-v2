import { z } from "zod";
import { createJob } from "../../../../@lib/pg-boss";

const StorePriceTickJobDataSchema = z.object({
  tokenId: z.uuid(),
});

export type StoreTokenPriceTickJobData = z.infer<
  typeof StorePriceTickJobDataSchema
>;

export const StoreTokenPriceTickJob =
  createJob<StoreTokenPriceTickJobData>("store-price-tick");
