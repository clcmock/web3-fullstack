import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { OracleState, IOracle } from '../types';
import { getOracleList } from '../../utils/api';

const initialState: OracleState = { oracleList: []};

export const walletSlice = createSlice({
  name: 'Oracle',
  initialState,
  reducers: {
    setOracleList: (state, action: PayloadAction<IOracle[]>) => {
      state.oracleList = action?.payload ?? [];
    },
   
  },
})

// Actions
export const { setOracleList } = walletSlice.actions;

export const handleGetOracleList = () => async (dispatch: Dispatch) => {
  // dispatch()
  try {
    const res = await getOracleList();
    dispatch(setOracleList(res.data));
  } catch(err) {
    console.log(err)
  }
}

export default walletSlice.reducer