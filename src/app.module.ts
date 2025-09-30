import { Module } from "@nestjs/common";
import { TokenTickerModule } from "./@logic/token-ticker/token-ticker.module";

@Module({
  imports: [TokenTickerModule],
  controllers: [],
})
export class AppModule {}
