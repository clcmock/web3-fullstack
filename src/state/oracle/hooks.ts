import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getOracleList } from '../../utils/api';
import { IOracle } from '../types';
import { setOracleList } from './';

export async function getCoinPrice(subscriptionId: string): Promise<number> {
  return new Promise((resolve) => {
    resolve(Number((Math.random() * 180).toFixed(2)))
  })
}

export function useGetOracleList() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    async function fetch () {
      const res = await getOracleList();
      // let newData: any[] = [];
      const newData = await Promise.all((res.data || []).map(async (item: IOracle) => {
        const price = await getCoinPrice(item.id);
        return {
          ...item,
          coinPrice: price
        }
      }));
      dispatch(setOracleList(newData));
    } 
    fetch();
  }, [dispatch])
}

export function useOracleList() {
  const [oracleList, setOracleList] = useState([] as IOracle[]);
  const oracleListN = useAppSelector(state => state.oracle.oracleList);

  useEffect(() => {
    setOracleList(oracleListN);
  }, [oracleListN]);

  return oracleList;
}