import { Module } from '@nestjs/common';
import { BalancesModule } from './balances/balances.module';

@Module({
  imports: [BalancesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
