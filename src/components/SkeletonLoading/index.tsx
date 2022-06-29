import React from "react";
import style from '../ReactUI/index.module.scss';
import { SkeletonCard } from "../OracleCard";

export function SkeletonLoading() {
  return (
    <div className={'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 '}>
          
      <div className={style['card-wrap']}>
        <SkeletonCard />
      </div>
      <div className={style['card-wrap']}>
        <SkeletonCard />
      </div>
      <div className={style['card-wrap']}>
        <SkeletonCard />
      </div>
      <div className={style['card-wrap']}>
        <SkeletonCard />
      </div>
      <div className={style['card-wrap']}>
        <SkeletonCard />
      </div>
      <div className={style['card-wrap']}>
        <SkeletonCard />
      </div>
      <div className={style['card-wrap']}>
        <SkeletonCard />
      </div>
    </div>
  )
}