import { RedisModule } from "@liaoliaots/nestjs-redis";
import { Logger, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SharedConfigModule } from "../shared-config/shared-config.module";

@Module({
  imports: [
    RedisModule.forRootAsync(
      {
        imports: [SharedConfigModule],
        useFactory: (configService: ConfigService) => {
          const redisUrl: string = configService.getOrThrow("REDIS_URL");
          const redisDbNumber: number = Number(
            configService.getOrThrow("REDIS_DB_NUMBER")
          );
          Logger.debug(
            `Redis uri: ${redisUrl}. Db number: ${redisDbNumber}`,
            "RedisModule"
          );
          return {
            config: [
              {
                url: redisUrl,
                db: redisDbNumber,
                connectTimeout: 10000,
                onClientCreated: (client) => {
                  Logger.debug(
                    `Connected to redis: ${redisUrl}/${redisDbNumber}`,
                    "RedisModule"
                  );
                  client.on("error", (error) => {
                    Logger.error(`Redis error: ${error}`, "RedisModule");
                  });
                },
              },
            ],
          };
        },
        inject: [ConfigService],
      },
      false
    ),
  ],
  exports: [RedisModule],
})
export class SharedRedisModule {}
