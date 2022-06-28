
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import injectEthereum from '../../utils/wallet';
import { setAccount, setChainId } from '.';


export const useConnect = () => {
  const dispatch = useAppDispatch();

  const handleActive = useCallback(() => {
    localStorage.setItem('loginType', 'metamask');
    injectEthereum.activate({
      chainChanged: (chainId) => {
        dispatch(setChainId(chainId));
      },
      accountsChanged: (account) => {
        dispatch(setAccount(account[0]));
      },
      networkChanged: (args) => {
        console.log(args)
      },
      close: (args) => {
        console.log(args);
        
      },
    }).then((res: any) => {
      dispatch(setAccount(res.address));
    });
  }, [dispatch]);

  return { login: handleActive }
}

export const useWalletState = () => {
  const [ account, setAccount ] = useState('');
  const [ chainId, setChainId ] = useState('');

  const accountN = useAppSelector(state => state.wallet.account);
  const chainIdN = useAppSelector(state => state.wallet.chainId);

  useEffect(() => {
    setAccount(accountN);
    setChainId(chainIdN);
  }, [accountN, chainIdN]);

  return { account, chainId };
}

