import { BalanceType } from '../dto/create-balance.dto';
import { Balance } from '../entities/balance.entity';

export abstract class BalanceRepositoryInterface {
  abstract findOne(accountId: string): Promise<Balance | undefined>;
  abstract create(event: BalanceType): Promise<void>;
}
