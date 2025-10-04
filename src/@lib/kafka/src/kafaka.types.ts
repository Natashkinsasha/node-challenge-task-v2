import { logLevel, SASLOptions } from 'kafkajs';

export type KafkaModuleOptions = {
  clientId: string;
  brokers: string[];
  ssl?: boolean;
  sasl?: SASLOptions | undefined;
  connectionTimeoutMs?: number;
  logLevel?: logLevel;
};

export type ConsumerOptions = {
  groupId: string;
  topics: string[];
  fromBeginning?: boolean;
  concurrency?: number; // параллелизм сообщений (eachMessage)
};
