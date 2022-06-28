import warning from 'tiny-warning'
import VisionWeb from 'visionweb'
import Lockr from "lockr";
import Web3 from 'web3';

import {
  CHAIN_chainName,
  CHAIN_ID_MAINNET,
  CHAIN_ID_VPIONEER,
  CHAIN_ID_TEST,
  SET_NETWORK,
  CHAIN_NETWORK,
  MAINNETFULLNODE
} from '../constants'

const __DEV__ = process.env.NODE_ENV !== 'production'

const supportId = [CHAIN_ID_MAINNET, CHAIN_ID_VPIONEER, CHAIN_ID_TEST]

function parseSendReturn(sendReturn){
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
  constructor(kwargs) {
    this.handleNetworkChanged = this.handleNetworkChanged.bind(this)
    this.handleChainChanged = this.handleChainChanged.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }
  /**
   * 
   * @param {string | number} chainId 
   */
  handleChainChanged(chainId){
    if (__DEV__) {
      console.log("Handling 'chainChanged' event with payload", chainId)
    }
    // this.emitUpdate && this.emitUpdate({ chainId, provider: window.ethereum })
    // window.location.reload()

    // console.log(chainId)
  }
  /**
   * 
   * @param {string[]} accounts 
   */
  handleAccountsChanged(accounts){
    if (__DEV__) {
      console.log("Handling 'accountsChanged' event with payload", accounts)
    }
    // if (accounts.length === 0) {
    //   this.emitDeactivate && this.emitDeactivate()
    // } else {
    //   this.emitUpdate && this.emitUpdate({ account: accounts[0] })
    // }
    window.location.reload()
  }
  /**
   * 
   * @param {number} code 
   * @param {string} reason 
   */
  handleClose(code, reason) {
    if (__DEV__) {
      console.log("Handling 'close' event with payload", code, reason)
    }
    // this.emitDeactivate && this.emitDeactivate()
    Lockr.set("islogin", 0)
    Lockr.set("loginwithmetamask", 0)
    window.location.reload()
  }
  /**
   * 
   * @param {string | number} networkId 
   */
  handleNetworkChanged(networkId) {
    console.log(networkId)
    const chain = SET_NETWORK[networkId] || 'mainnet'
    const fullNode = CHAIN_NETWORK[networkId] || MAINNETFULLNODE
    Lockr.set('nowChain', chain)
    Lockr.set('VISION_FULLNODE', fullNode)
    // console.log(networkId);
    // if (__DEV__) {
    //   console.log("Handling 'networkChanged' event with payload", networkId)
    // }
    // this.emitUpdate && this.emitUpdate({ chainId: networkId, provider: window.ethereum })
    // Lockr.set("islogin", 0)
    // Lockr.set("loginwithmetamask", 0)
    window.location.reload()
  }
  setupNetwork = async () => {
    const provider = window.ethereum
    if (provider) {
      let CchainName = CHAIN_chainName()
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: CchainName.chainId,
              chainName: CchainName.chainName,
              nativeCurrency: {
                name: 'VS',
                symbol: 'VS',
                decimals: 18,
              },
              rpcUrls: [CchainName.rpcUrls],
              blockExplorerUrls: ['https://www.visionscan.org/'],
            },
          ],
        })
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    } else {
      console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
      return false
    }
  }
  switchEthereumChain = async (chainId) => {
    let CchainName = CHAIN_chainName()
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: CchainName.chainId}]
    })
  }
  async activate(){
    let CchainName = CHAIN_chainName()
    if (!window.ethereum) {
      // throw new NoEthereumProviderError()
      return;
    }


    if (window.ethereum.on) {
      window.ethereum.on('chainChanged', this.handleChainChanged)
      window.ethereum.on('accountsChanged', this.handleAccountsChanged)
      window.ethereum.on('close', this.handleClose)
      window.ethereum.on('networkChanged', this.handleNetworkChanged)
    }
    let account
    try {
      // 判断当前链ID是不是，vision链，不是，则请求切换网络
      // eslint-disable-next-line no-mixed-operators
      if (window.ethereum.chainId && !supportId.includes(window.ethereum.chainId) || (window.ethereum.chainId !== CchainName.chainId)) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: CchainName.chainId}]
        })
      }
      if ((window.ethereum).isMetaMask) {
        ;(window.ethereum).autoRefreshOnNetworkChange = false
      }

    // try to activate + get account via eth_requestAccounts
    
      account = await (window.ethereum.send)('eth_requestAccounts').then(
        sendReturn => parseSendReturn(sendReturn)[0]
      )
    } catch (error) {
      if (error.code === 4902) {
        await this.setupNetwork()
      }

      // if ((error).code === 4001 || (error).code === -32002 ) {
      //   throw new UserRejectedRequestError()
      // }
      warning(false, 'eth_requestAccounts was unsuccessful, falling back to enable')
      return {}
    }
    

    // if unsuccessful, try enable
    if (!account) {
      // if enable is successful but doesn't return accounts, fall back to getAccount (not happy i have to do this...)
      account = await window.ethereum.enable().then(sendReturn => sendReturn && parseSendReturn(sendReturn)[0])
    }

    return { provider: window.ethereum, isMetaMask: true, ...(account ? { address: account } : {}) }
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
      chainId = await (window.ethereum.send)('eth_chainId').then(parseSendReturn)
    } catch {
      warning(false, 'eth_chainId was unsuccessful, falling back to net_version')
    }

    if (!chainId) {
      try {
        chainId = await (window.ethereum.send)('net_version').then(parseSendReturn)
      } catch {
        warning(false, 'net_version was unsuccessful, falling back to net version v2')
      }
    }

    if (!chainId) {
      try {
        chainId = parseSendReturn((window.ethereum.send)({ method: 'net_version' }))
      } catch {
        warning(false, 'net_version v2 was unsuccessful, falling back to manual matches and static properties')
      }
    }

    if (!chainId) {
      if ((window.ethereum).isDapper) {
        chainId = parseSendReturn((window.ethereum).cachedResults.net_version)
      } else {
        chainId =
          (window.ethereum).chainId ||
          (window.ethereum).netVersion ||
          (window.ethereum).networkVersion ||
          (window.ethereum)._chainId
      }
    }

    return chainId
  }

  async getAccount(){
    if (!window.ethereum) {
      return false
    }

    let account
    try {
      account = await (window.ethereum.send)('eth_accounts').then(sendReturn => parseSendReturn(sendReturn)[0])
    } catch {
      warning(false, 'eth_accounts was unsuccessful, falling back to enable')
    }

    if (!account) {
      try {
        account = await window.ethereum.enable().then(sendReturn => parseSendReturn(sendReturn)[0])
      } catch {
        warning(false, 'enable was unsuccessful, falling back to eth_accounts v2')
      }
    }

    if (!account) {
      account = parseSendReturn((window.ethereum.send)({ method: 'eth_accounts' }))[0]
    }

    return account
  }
  async emitUpdate (item){
    injectEthereum.activate()
  }

  deactivate() {
    if (window.ethereum && window.ethereum.removeListener) {
      window.ethereum.removeListener('chainChanged', this.handleChainChanged)
      window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged)
      window.ethereum.removeListener('close', this.handleClose)
      window.ethereum.removeListener('networkChanged', this.handleNetworkChanged)
    }
  }

  async isAuthorized(){
    if (!window.ethereum) {
      return false
    }

    try {
      return await (window.ethereum.send)('eth_accounts').then(sendReturn => {
        if (parseSendReturn(sendReturn).length > 0) {
          return true
        } else {
          return false
        }
      })
    } catch {
      return false
    }
  }
  base58ToEth(address) {
    if (address.indexOf('0x') <= -1) {
      return '0x' + VisionWeb.address.toHex(address).slice(2)
    }
    return address
  }
  async transfer(from, to, value) {
    try {
      const ethereum = Lockr.get("loginwithwalletconnect") ? window.ethereumProvider : window.ethereum
      console.log(from, this.base58ToEth(to), value)
      const result = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from,
            to: this.base58ToEth(to),
            value,
            gas: '0x76c0',
            gasPice: '0x9184e72a000'
          },
        ],
      });
      return {result}
    } catch (err) {
      console.log(err)
      return null
    }
  }
  // 合约部署
  async deployContract(options) {
    const ethereum = Lockr.get("loginwithwalletconnect")  ? window.ethereumProvider : window.ethereum
    const web3 = new Web3(ethereum)
    return new Promise((resolve, reject) => {
      try {
        let contractObject = new web3.eth.Contract(options.abi)
        let deployObject = contractObject.deploy({arguments: options.parameters, data: '0x' + options.bytecode})
        deployObject.estimateGas().then(async (gasValue) => {
          const gasBase = Math.ceil(gasValue * 1.2)
          const gas = gasBase * 2
          deployObject.send({
              from: ethereum.selectedAddress,
              gas: 210000
          }).on('error', function(error){
            console.log(error)
            resolve(undefined)
          })
          .on('transactionHash', function(transactionHash){ 
            resolve(transactionHash)
          })
        })
      } catch (err) {
        console.log(err)
        resolve(undefined)
      }
      
    })
  }
  // 获取合约
  async getContract(abi = [], address) {
    try  {
      const ethereum = Lockr.get("loginwithwalletconnect")  ? window.ethereumProvider : window.ethereum
      const  newAbi = this.formatAbi(abi);
      if (!address) return null;
      const web3 = new Web3(ethereum);
      let contractObj = await new web3.eth.Contract(newAbi, VisionWeb.address.toEth(address));
      // 将methods绑定到合约对象直接属性
      for(let key in contractObj.methods) {
        if (!contractObj[key]) {
          contractObj[key] = function() {
            const args = Array.from(arguments).map(arg => {
              if(VisionWeb.isAddress(arg)) {
                return VisionWeb.address.toEth(arg);
              }
              return arg;
            })
            return contractObj.methods[key](...args);
          }
        }
      }
      contractObj.isMetaMask = true;
      
      contractObj.defaultAccount = ethereum.selectedAddress;
      return contractObj;
    } catch(e) {
      console.log(e)
      return null;
    }
  } 
  // 合约abi重新格式化，以适配web3
  formatAbi(abi = []){
    return abi.map(item  => {
      if(item.inputs === undefined) {
        item.inputs = [];
      }
      if (item.constant === true)  {
        item.outputs.forEach(output => {
          if (output.name === undefined) {
            output.name = '';
          }
        });
      }
      if (item.constant === false)  {
        item.outputs.forEach(output => {
          if (output.name === undefined) {
            output.name = 'success';
          }
        });
      }
      item.stateMutability = item.stateMutability.toLowerCase();
      item.type = item.type.toLowerCase();
      item.payable = Boolean(item.payable);

      return item;
    })
  }
}

const injectEthereum = new InjectedConnector()
export default injectEthereum
