import { RedisService } from "@liaoliaots/nestjs-redis";
import { forwardRef, Module } from "@nestjs/common";
import { JobModule } from "../../@lib/job/src";
import { SharedRedisModule } from "../shared-redis";

@Module({
  imports: [
    JobModule.forRootAsync({
      imports: [forwardRef(() => SharedRedisModule)],
      inject: [RedisService],
      useFactory: (redisService: RedisService) => {
        return {
          connection: redisService
            .getClient()
            .duplicate({ maxRetriesPerRequest: null }),
          defaultJobOptions: {
            removeOnComplete: {
              count: 100,
              age: 60000,
            },
            removeOnFail: {
              count: 10000,
              age: 60000,
            },
          },
        };
      },
    }),
  ],
  exports: [JobModule],
})
export class SharedJobModule {}
