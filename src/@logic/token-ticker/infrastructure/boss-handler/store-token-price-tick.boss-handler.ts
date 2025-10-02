import { Injectable } from "@nestjs/common";
import { Job } from "pg-boss";
import { TokenPriceUpdateService } from "../../application/service/token-price-update.service";
import {
  StoreTokenPriceTickJob,
  StoreTokenPriceTickJobData,
} from "../boss-job/store-token-price-tick.boss-job";

@Injectable()
export class StoreTokenPriceTickBossHandler {
  constructor(
    private readonly tokenPriceUpdateService: TokenPriceUpdateService
  ) {}

  @StoreTokenPriceTickJob.Handle()
  async handleJob(job?: Job<StoreTokenPriceTickJobData>) {
      console.log({job});
    if (!job) {
      return;
    }
    await this.tokenPriceUpdateService.updateTokenPrice(job.data.tokenId);
  }
}
