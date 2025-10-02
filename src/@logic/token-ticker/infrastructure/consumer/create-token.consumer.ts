import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { EventHandler } from "@torixtv/nestjs-kafka";
import { Queue } from "bullmq";
import {
  TokenPriceTrickBullHandler,
  TokenPriceTrickBullJobDate,
} from "../bull-handler/token-price-trick.bull-handler";

@Injectable()
export class CreateTokenConsumer {
  constructor(
    @InjectQueue(TokenPriceTrickBullHandler.getName())
    private readonly tokenPriceTrickQueue: Queue<TokenPriceTrickBullJobDate>
  ) {}
  @EventHandler("token.create")
  async handlerTokenCreate(
    tokenId: string,
    every: number = 5000
  ): Promise<void> {
    const jobId = `token-price-trick-${tokenId}`;
    const job = await this.tokenPriceTrickQueue.add(
      `Token price trick: ${tokenId}`,
      { tokenId },
      { jobId, repeat: { every, key: jobId } }
    );
    console.log(job);
  }
}
