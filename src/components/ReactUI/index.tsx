import React, { useState } from "react";
import style from './index.module.scss';
import { OracleCard } from "../OracleCard";
import { dataList } from "./data";

export function ReactUI() {
  const filterList = dataList.map(item => {
    return {
      ...item,
      expiryDate: `${item.createdTimestamp} + 3s * (${item.leaseEnd} - ${item.blockNumber})`
    }
  })
  const [lists, setLists] = useState(filterList);

  return (
    <div className={'flex items-center justify-center ' + style['RectUI-root']}>
      <div className="inline-block">
        <div className={'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 '}>
          {
            lists.map(list => <div key={list.id} className={style['card-wrap']}>
            <OracleCard coinName={list.symbol} status={list.status} expiryDate={list.expiryDate} />
          </div>)
          }
          
          {/* <div className={style['card-wrap']}>
            <OracleCard />
          </div>
          <div className={style['card-wrap']}>
            <OracleCard />
          </div>
          <div className={style['card-wrap']}>
            <OracleCard />
          </div>
          <div className={style['card-wrap']}>
            <OracleCard />
          </div>
          <div className={style['card-wrap']}>
            <OracleCard />
          </div>
          <div className={style['card-wrap']}>
            <OracleCard />
          </div>
          <div className={style['card-wrap']}>
            <OracleCard />
          </div> */}
        </div>
      </div>
      
    </div>
  );
}