export type PayloadProps = {
  account_id_from: string;
  account_id_to: string;
  balance_account_id_from: number;
  balance_account_id_to: number;
};

export type BalanceType = {
  accountIdFrom: string;
  accountIdTo: string;
  balanceAccountIdFrom: number;
  balanceAccountIdTo: number;
};

export class CreateBalanceDto {
  Name: string;
  Payload: PayloadProps;
}
