import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { WalletState } from '../types'

const initialState: WalletState = { account: '', chainId: '' }

export const walletSlice = createSlice({
  name: 'Wallet',
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<string>) => {
      state.account = action?.payload ?? '';
    },
    setChainId: (state, action: PayloadAction<string>) => {
      state.chainId = action?.payload ?? '';
    }
  },
})

// Actions
export const { setAccount, setChainId } = walletSlice.actions

export default walletSlice.reducer