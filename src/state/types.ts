
export type WalletState = { account: string, chainId: string };

export type IOracle = {
  id: string,
  blockNumber: number,
  symbol: string,
  coinPrice: number,
  leaseEnd: number,
  createdTimestamp: string,
  status: number,
  expiryDate: string,
  coinPriceLabel: string,
};

export type OracleState = {
  oracleList: IOracle[]
};

export interface State {
  wallet: WalletState,
  oracle: OracleState
}