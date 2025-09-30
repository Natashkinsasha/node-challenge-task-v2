import { Module } from "@nestjs/common";
import { KafkaModule } from "nestjs-kafka";

@Module({
  imports: [
    KafkaModule.register({
      clientId: "go1-node-app",
      brokers: ["localhost:9092"],
      groupId: "something",
    }),
  ],
  exports: [KafkaModule],
})
export class SharedKafkaModule {}
