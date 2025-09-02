import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { AppModule } from './app.module';

const config = new ConfigService();

async function bootstrap() {
  // Cria app HTTP (para expor porta 3003)
  const app = await NestFactory.create(AppModule);

  // Conecta microserviço Kafka em modo híbrido
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'my-consumer',
        brokers: [process.env.KAFKA_BOOTSTRAP_SERVERS || 'localhost:9092'],
      },
      consumer: {
        groupId: 'wallet',
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner,
      },
    },
  });

  const port = +config.getOrThrow('PORT');

  await app.startAllMicroservices();
  await app.listen(port);
  console.log(`🚀 Microsservice running on port: ${port}`);
}
void bootstrap();
