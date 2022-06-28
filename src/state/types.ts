
export type WalletState = { account: string, chainId: string }

export interface State {
  wallet: WalletState,
}