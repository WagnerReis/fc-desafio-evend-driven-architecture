import { Injectable, Logger } from '@nestjs/common';
import { BalanceType } from 'src/balances/dto/create-balance.dto';
import { Balance } from 'src/balances/entities/balance.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { BalanceRepositoryInterface } from '../balance-repository.interface';
import { PrismaBalanceMapper } from './prisma-balance.mapper';

@Injectable()
export class BalanceRepository implements BalanceRepositoryInterface {
  private readonly logger = new Logger(BalanceRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  async findOne(accountId: string): Promise<Balance | undefined> {
    const balance = await this.prisma.balances.findFirst({
      where: {
        OR: [{ accountIdFrom: accountId }, { accountIdTo: accountId }],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!balance) {
      this.logger.log('No balance found');
      return undefined;
    }

    return PrismaBalanceMapper.toDomain(balance);
  }

  async create(balance: BalanceType): Promise<void> {
    await this.prisma.balances.create({ data: balance });
    this.logger.log('Balance created');
  }
}
