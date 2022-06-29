
import { useMemo } from 'react';
import { getBep20Contract } from '../utils/contractHelper';
import useWeb3 from './useWeb3';

export const useERC20 = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getBep20Contract(address, web3), [address, web3])
}

export default useERC20;