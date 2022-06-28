import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js'
import useERC20 from '../../hooks/useContract';
import useTokenBalance from '../../hooks/useTokenBalance';
import { useConnect, useWalletState } from '../../state/wallet/hooks';
import { tokenAddress } from '../../config';
import Web3 from 'web3';

export function Web3Fullstack() {
  const { login } = useConnect();
  const { account } = useWalletState();
  const tokenContract = useERC20(tokenAddress);
  // const balance = useTokenBalance(tokenAddress);

  const [ toAccount, setToAccount ] = useState(''); // 0x61f80F2a4f6a70AD925144A268616b5946b3F5cA
  const [ amount, setAmount ] = useState('');

  const [ step, setStep ] = useState(1);

  useEffect(() => {
    if (localStorage.getItem('loginType') === 'metamask') {
      login();
    }
  }, []);

  const handleTransfer = async () => {
    try{
      if (step > 1) return;
      const isValidAddress = Web3.utils.isAddress(toAccount);
      if (!isValidAddress) {
        alert('Please enter a valid wallet address');
        return;
      }
      if (Number(amount) <= 0 ) {
        alert('Please enter a amount');
        return;
      }
      await tokenContract.methods
      .transfer(toAccount, new BigNumber(amount).times(Math.pow(10, 9)))
      .send({ from: account })
      .on('sending', (res: any) => {
        setStep(2);
      })
      .on('receipt', (res: any) => {
        setStep(3);
        setTimeout(() => {
          setStep(1);
        }, 1000)
      })
      .on('error', (err: any) => {
        console.log(err);
      })
    } catch (e) {
      console.log(e);
    }
    
  }

  return (
    <div className='md:container md:mx-auto mt-5 text-center'>
        <div className='w-96 text-left inline-block'>
          <div className='text-2xl font-medium'>Transfer</div>
          <div className='text-base mt-4 mb-4'>From your address: {account.slice(0, 6) + '...' + account.slice(-6)}</div>
          <div className='text-base mt-4 mb-4'>Transfer your Token here</div>
          <div className='text-base'>Address</div>
          <input type="text" className='h-9 border w-10/12 mt-2 p-2' 
            value={ toAccount } 
            onChange={(e) => {
              setToAccount(e.target.value);
            }}
          />
          <div className='text-base mt-2'>Token Amount</div>
          <input type="numbe" className='h-9 border w-10/12 mt-2 p-2'
            value={ amount }
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
          <div className='text-base mt-2 text-gray-500'>Make sure you have IYO Token</div>
          <button className='bg-black text-white pl-5 pr-5 pt-2 pb-2 mt-5'
            onClick={() => {
              if (!account) {
                login();
              } else {
                handleTransfer();
              }
              
            }}
          >
            { step === 1 ? 'Transfer' : (step === 2 ? 'Sending...': 'Confirmed') }
            
          </button>
        </div>
      </div>
  );
}