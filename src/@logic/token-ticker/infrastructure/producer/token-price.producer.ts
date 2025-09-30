import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { Kafka, Producer } from "kafkajs";
import {KafkaPayload, KafkaService} from "nestjs-kafka";

@Injectable()
export class TokenPriceProducer implements OnModuleDestroy {
  private readonly logger = new Logger(TokenPriceProducer.name);
  public static readonly TOPIC: string = "token-price-updates";

  constructor(private readonly kafkaService: KafkaService) {}

    public send(){
        const payload: KafkaPayload = {
            messageId: '' + new Date().valueOf(),
            body: message,
            messageType: TASK_PUSH_INFO,
            topicName: TASK_PUSH_INFO,
        };
      return this.kafkaService.sendMessage(this.TOPIC, payload)
    }

  private async connect(): Promise<void> {
    await this.producer.connect();
    this.logger.log("Connected to Kafka");
  }

  async sendPriceUpdateMessage(
    message: TokenPriceUpdateMessage
  ): Promise<void> {
    try {
      // Validate the message with Zod schema
      tokenPriceUpdateMessageSchema.parse(message);

      const value = JSON.stringify(message);

      this.producer.send({
        topic: this.TOPIC,
        messages: [
          {
            key: message.tokenId,
            value,
          },
        ],
      });

      this.logger.log(`Sent message to Kafka: ${value}`);
      return;
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.producer.disconnect();
      this.logger.log("Disconnected from Kafka");
    } catch (error) {
      this.logger.error("Error disconnecting from Kafka", error.stack);
    }
  }
}
