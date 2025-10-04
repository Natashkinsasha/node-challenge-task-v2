import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { z } from 'zod';

import { TokenPriceUpdateService } from '../../application/service/token-price-update.service';

export const tokenPriceTrickBullJobDateSchema = z.object({
  tokenId: z.uuid(),
});

export type TokenPriceTrickBullJobDate = z.infer<
  typeof tokenPriceTrickBullJobDateSchema
>;

@Processor(TokenPriceTrickBullHandler.getName())
export class TokenPriceTrickBullHandler extends WorkerHost {
  constructor(
    private readonly tokenPriceUpdateService: TokenPriceUpdateService,
  ) {
    super();
  }
  public async process(job: Job<TokenPriceTrickBullJobDate>): Promise<void> {
    const { tokenId } = tokenPriceTrickBullJobDateSchema.parse(job.data);
    const ticks = await this.tokenPriceUpdateService.updateTokenPrice(tokenId);
    await Promise.all(
      ticks.map((tick) => {
        return job.log(JSON.stringify(tick));
      }),
    );
  }

  public static getName() {
    return 'token-price-trick';
  }
}
