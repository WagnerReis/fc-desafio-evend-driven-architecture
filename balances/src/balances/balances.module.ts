import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BalancesController } from './balances.controller';
import { BalancesService } from './balances.service';
import { BalanceRepositoryInterface } from './repositories/balance-repository.interface';
import { BalanceRepository } from './repositories/prisma/balance-repository';

@Module({
  imports: [PrismaModule],
  controllers: [BalancesController],
  providers: [
    BalancesService,
    {
      provide: BalanceRepositoryInterface,
      useClass: BalanceRepository,
    },
  ],
})
export class BalancesModule {}
