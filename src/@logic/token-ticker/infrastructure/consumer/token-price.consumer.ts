import { Injectable } from "@nestjs/common";
import { AbstractKafkaConsumer, SubscribeTo } from "nestjs-kafka";
import { TokenPriceProducer } from "../producer/token-price.producer";

@Injectable()
export class TokenPriceConsumer extends AbstractKafkaConsumer {
  protected registerTopic(): any {
    this.addTopic(TokenPriceProducer.TOPIC);
  }

  @SubscribeTo(TokenPriceProducer.TOPIC)
  subscribe(_payload: string) {}
}
