import { Logger, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PGBossModule } from "../../@lib/pg-boss";
import { SharedConfigModule } from "../shared-config/shared-config.module";

@Module({
  imports: [
    PGBossModule.forRootAsync({
      imports: [SharedConfigModule],
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>("DATABASE_URL");
        return {
          connectionString: url,
          onError: (error: Error) => {
            Logger.error(error.message, error.stack, "PgBossModule");
          },
          application_name: "default",
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [PGBossModule],
})
export class SharedPgBossModule {}
