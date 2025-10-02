import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { KafkaModule } from "@torixtv/nestjs-kafka";
import { SharedConfigModule } from "../shared-config/shared-config.module";

@Module({
  imports: [
    KafkaModule.forRootAsync({
      imports: [SharedConfigModule],
      useFactory: (configService: ConfigService) => {
        const brokers = configService.getOrThrow("KAFKA_BROKERS");
        return {
          client: {
            clientId: "token-ticker",
            brokers: brokers.split(","),
          },
          consumer: {
            groupId: "token-ticker",
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [KafkaModule],
})
export class SharedKafkaModule {}
