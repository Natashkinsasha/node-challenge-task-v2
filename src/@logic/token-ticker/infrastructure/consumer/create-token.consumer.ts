import { Injectable } from "@nestjs/common";
import { EventHandler } from "@torixtv/nestjs-kafka";
import { JobService } from "../../../../@lib/pg-boss";
import {
  StoreTokenPriceTickJob,
  StoreTokenPriceTickJobData,
} from "../boss-job/store-token-price-tick.boss-job";

@Injectable()
export class CreateTokenConsumer {
  constructor(
    @StoreTokenPriceTickJob.Inject()
    private readonly storeTokenPriceTickJobService: JobService<StoreTokenPriceTickJobData>
  ) {}

  @EventHandler("token.create")
  async handlerTokenCreate(tokenId: string, cron?: string) {
    return this.storeTokenPriceTickJobService.schedule(
      cron ?? "*/5 * * * * *",
      {
        tokenId,
      },
      {
        singletonNextSlot: true,
        singletonSeconds: 20,
        singletonKey: `store-token-price-tick:${tokenId}`,
      }
    );
  }
}
