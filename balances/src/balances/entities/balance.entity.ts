export interface BalanceProps {
  id: string;
  accountIdFrom: string;
  accountIdTo: string;
  balanceAccountIdFrom: number;
  balanceAccountIdTo: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Balance {
  public readonly id: string;
  public readonly accountIdFrom: string;
  public readonly accountIdTo: string;
  public readonly balanceAccountIdFrom: number;
  public readonly balanceAccountIdTo: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: BalanceProps) {
    this.id = props.id;
    this.accountIdFrom = props.accountIdFrom;
    this.accountIdTo = props.accountIdTo;
    this.balanceAccountIdFrom = props.balanceAccountIdFrom;
    this.balanceAccountIdTo = props.balanceAccountIdTo;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
