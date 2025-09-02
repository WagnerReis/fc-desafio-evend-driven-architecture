import { Prisma, Balances as PrismaBalance } from '@prisma/client';
import { Balance } from 'src/balances/entities/balance.entity';

export class PrismaBalanceMapper {
  static toDomain(raw: PrismaBalance): Balance {
    return new Balance({
      id: raw.id,
      accountIdFrom: raw.accountIdFrom,
      accountIdTo: raw.accountIdTo,
      balanceAccountIdFrom: raw.balanceAccountIdFrom,
      balanceAccountIdTo: raw.balanceAccountIdTo,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPrisma(balance: Balance): Prisma.BalancesUncheckedCreateInput {
    return {
      id: balance.id,
      accountIdFrom: balance.accountIdFrom,
      accountIdTo: balance.accountIdTo,
      balanceAccountIdFrom: balance.balanceAccountIdFrom,
      balanceAccountIdTo: balance.balanceAccountIdTo,
      createdAt: balance.createdAt,
      updatedAt: balance.updatedAt,
    };
  }
}
