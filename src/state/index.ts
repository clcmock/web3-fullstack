import { configureStore } from "@reduxjs/toolkit";
import walletReducer from './wallet';
import oracleReducer from "./oracle";

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    oracle: oracleReducer
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;