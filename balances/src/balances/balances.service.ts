import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BalanceType, PayloadProps } from './dto/create-balance.dto';
import { BalanceRepositoryInterface } from './repositories/balance-repository.interface';

@Injectable()
export class BalancesService {
  constructor(
    private readonly balancesRepository: BalanceRepositoryInterface,
  ) {}

  async findOne(accountId: string) {
    try {
      const balance = await this.balancesRepository.findOne(accountId);

      if (!balance) {
        throw new NotFoundException('Account or Balance not found');
      }

      return balance;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async create(message: PayloadProps): Promise<void> {
    try {
      if (
        !message ||
        !message.account_id_from ||
        !message.account_id_to ||
        message.balance_account_id_from === undefined ||
        message.balance_account_id_to === undefined
      ) {
        throw new BadRequestException('Invalid payload for BalanceUpdated');
      }

      const data = {
        accountIdFrom: message.account_id_from,
        accountIdTo: message.account_id_to,
        balanceAccountIdFrom: Number(message.balance_account_id_from),
        balanceAccountIdTo: Number(message.balance_account_id_to),
      } as BalanceType;

      await this.balancesRepository.create(data);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
