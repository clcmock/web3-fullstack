import React, { useCallback, useEffect } from 'react';
import { useConnect, useWalletState } from '../../state/wallet/hooks';

export function Web3Fullstack() {
  const { login } = useConnect();
  const { account } = useWalletState();

  useEffect(() => {
    if (localStorage.getItem('loginType') === 'metamask') {
      login();
    }
  }, [])

  return (
    <div className='md:container md:mx-auto mt-5 text-center'>
        <div className='w-96 text-left inline-block'>
          <div className='text-2xl font-medium'>Transfer</div>
          <div className='text-base mt-4 mb-4'>From your address: {account.slice(0, 6) + '...' + account.slice(-6)}</div>
          <div className='text-base mt-4 mb-4'>Transfer your Token here</div>
          <div className='text-base'>Address</div>
          <input type="text" className='h-9 border w-10/12 mt-2 p-2' />
          <div className='text-base mt-2'>Token Amount</div>
          <input type="number" className='h-9 border w-10/12 mt-2 p-2' />
          <div className='text-base mt-2 text-gray-500'>Make sure you have IYO Token</div>
          <button className='bg-black text-white pl-5 pr-5 pt-2 pb-2 mt-5'
            onClick={() => {
              login();
            }}
          >Transfer</button>
        </div>
      </div>
  );
}