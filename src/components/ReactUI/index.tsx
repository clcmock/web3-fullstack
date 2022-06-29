import React, { useEffect, useState } from "react";
import Moment from 'moment';
import BigNumber from "bignumber.js";
import style from './index.module.scss';
import { OracleCard } from "../OracleCard";
import { useGetOracleList, useOracleList } from "../../state/oracle/hooks";
import { IOracle } from "../../state/types";
import { SkeletonLoading } from "../SkeletonLoading";


export function ReactUI() {
  useGetOracleList();
  const oracleList = useOracleList();
  const [lists, setLists] = useState([] as IOracle[]);
  const [cardId, setCardId] = useState('');
  const [loading, setLoding] = useState(true);

  useEffect(() => {
    const filterList = oracleList.map(item => {
      const expireTime = new Date(item.createdTimestamp).getTime() + 3 * 60 * (item.leaseEnd - item.blockNumber);
      return {
        ...item,
        expiryDate: Moment(expireTime).format('DD/MMM/YYYY HH:mm'),
        coinPriceLabel: new BigNumber(item.coinPrice).toFormat(2)
      }
    });
    setTimeout(() => {
      setLists(filterList);
      setLoding(false);
    }, 2000);
  }, [oracleList])
  useEffect(() => {
    function documentClick(){
      setCardId('');
    }
    document.body.addEventListener('click', documentClick);
    return () => {
      document.body.removeEventListener('click', documentClick);
    }
  }, [])

  return (
    <div className={'flex items-center justify-center ' + style['RectUI-root']}>
      <div className="inline-block">
        {
          loading ? <SkeletonLoading /> : 
          <div className={'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 '}>
          {
            lists.map((list: IOracle) => <div key={list.id} className={style['card-wrap']}>
            <OracleCard isSelectd={cardId === list.id} id={list.id} coinName={list.symbol} status={list.status} expiryDate={list.expiryDate} cointPrice={list.coinPriceLabel}
              onClick={(id) => {
                setCardId(id);
              }}
            />
          </div>)
          }
        </div>
        }
        
      </div>
      
    </div>
  );
}