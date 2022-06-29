import Web3 from 'web3';
import { ChainId, BASE_BSC_SCAN_URLS } from "../config";

export const nodes = [process.env.REACT_APP_NODE_1];
// https://bsc-dataseed4.ninicoin.io
// https://data-seed-prebsc-1-s1.binance.org:8545

const NETWORK_CONFIG = {
  [ChainId.TESTNET]: {
    name: 'BNB Smart Chain Testnet',
    scanURL: BASE_BSC_SCAN_URLS[ChainId.TESTNET],
  },
}

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async () => {
  const provider = window.ethereum;
  if (!provider) return;
  const chainId = parseInt(process.env.REACT_APP_CHAIN_ID ?? '97', 10) as keyof typeof NETWORK_CONFIG;

  if (!NETWORK_CONFIG[chainId]) {
    console.error('Invalid chain id');
    return false;
  }
  if (provider) {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      return true;
    } catch (switchError) {
      if ((switchError as any)?.code === 4902) {
        try {
          console.log(provider, chainId)
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                chainName: NETWORK_CONFIG[chainId].name,
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'bnb',
                  decimals: 18,
                },
                rpcUrls: nodes,
                blockExplorerUrls: [`${NETWORK_CONFIG[chainId].scanURL}/`],
              },
            ],
          });
          return true;
        } catch (error) {
          console.error('Failed to setup the network in Metamask:', error);
          return false;
        }
      }
      return false;
    }
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined");
    return false;
  }
}

export interface IActions {
  chainChanged: (...args: any[]) => void;
  accountsChanged: (...args: any[]) => void;
  networkChanged: (...args: any[]) => void;
  close: (...args: any[]) => void;
}

const supportId = [process.env.REACT_APP_CHAIN_ID]

function parseSendReturn(sendReturn: {result: any}){
  return sendReturn.hasOwnProperty('result') ? sendReturn.result : sendReturn
}

export class NoEthereumProviderError extends Error {
  constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'No Ethereum provider was found on window.ethereum.'
  }
}

export class UserRejectedRequestError extends Error {
  constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'The user rejected the request.'
  }
}

export class InjectedConnector {
  actions: IActions | undefined;
  async activate(actions: IActions){
    if (!window.ethereum) {
      throw new NoEthereumProviderError()
    }
    if (window.ethereum.on) {
      this.actions = actions;
      window.ethereum.on('chainChanged', actions.chainChanged)
      window.ethereum.on('accountsChanged', actions.accountsChanged)
      window.ethereum.on('disconnect', actions.close)
    }
    let account
    try {
      if (window.ethereum.chainId && !supportId.includes(window.ethereum.chainId)) {
        await setupNetwork();
      }
      if ((window.ethereum).isMetaMask) {
        ;(window.ethereum).autoRefreshOnNetworkChange = false
      }

      account = await window.ethereum.request({method: 'eth_requestAccounts'}).then(
        sendReturn => parseSendReturn(sendReturn)[0]
      )
    } catch (error: any) {
      console.log(error)
      await setupNetwork()
      console.warn('eth_requestAccounts was unsuccessful, falling back to enable')
      return {}
    }
    // if unsuccessful, try enable
    if (!account) {
      // if enable is successful but doesn't return accounts, fall back to getAccount (not happy i have to do this...)
      account = await window.ethereum.enable().then((sendReturn: { result: any; }) => sendReturn && parseSendReturn(sendReturn)[0])
    }

    return { provider: window.ethereum, ...(account ? { address: account } : {}) }
  }

  async getProvider(){
    return window.ethereum
  }

  async getChainId(){
    if (!window.ethereum) {
      throw new NoEthereumProviderError()
    }

    let chainId
    try {
      chainId = await (window.ethereum.sendAsync)('eth_chainId').then(parseSendReturn)
    } catch {
      chainId = (window.ethereum).chainId
    }
    return chainId
  }
  async getAccount(){
    if (!window.ethereum) {
      return false
    }

    let account
    try {
      account = await (window.ethereum.sendAsync)('eth_accounts').then(sendReturn => parseSendReturn(sendReturn)[0])
    } catch {
      console.warn('eth_accounts was unsuccessful, falling back to enable')
    }

    if (!account) {
      try {
        account = await window.ethereum.enable().then((sendReturn: { result: any; }) => parseSendReturn(sendReturn)[0])
      } catch {
        console.warn('enable was unsuccessful, falling back to eth_accounts v2')
      }
    }

    if (!account) {
      account = parseSendReturn(await (window.ethereum.sendAsync)({ method: 'eth_accounts' }))[0]
    }

    return account
  }
  
  deactivate() {
    if (window.ethereum && window.ethereum.removeListener && this.actions) {
      window.ethereum.removeListener('chainChanged', this.actions.chainChanged)
      window.ethereum.removeListener('accountsChanged', this.actions.accountsChanged)
      window.ethereum.removeListener('close', this.actions.close)
      window.ethereum.removeListener('networkChanged', this.actions.networkChanged)
    }
  }
}

export default new InjectedConnector();