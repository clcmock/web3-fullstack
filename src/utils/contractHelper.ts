import Web3 from 'web3';
import { nodes } from './wallet';

const RPC_URL = nodes[0];
const httpProvider = new Web3.providers.HttpProvider(RPC_URL as string, { timeout: 10000 })
const web3NoAccount = new Web3(httpProvider)

export const getWeb3NoAccount = () => {
  return web3NoAccount
}
const getContract = (abi: any, address: string, web3?: Web3) => {
   const _web3 = window.ethereum ? new Web3(window.ethereum) : web3NoAccount
   return new _web3.eth.Contract(abi, address)
}