import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useWalletState } from '../state/wallet/hooks';
import useERC20 from './useContract';

const useTokenBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account } = useWalletState();
  const contract = useERC20(tokenAddress);

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await contract.methods.balanceOf(account).call();
      const decimals = await contract.methods.decimals().call();
      setBalance(new BigNumber(res).div(Math.pow(10, decimals)));
    }

    if (account && contract) {
      fetchBalance()
    }
  }, [account, tokenAddress, contract])

  return balance
}

export default useTokenBalance
