import React from "react";
import style from './index.module.scss';
import { OracleCard } from "../OracleCard";

export function ReactUI() {
  return (
    <div className={'flex align-middle justify-center ' + style['RectUI-root']}>
      <div className={'grid grid-cols-3'}>
        <div className={'' + style['']}>
          <OracleCard />
        </div>
      </div>
    </div>
  );
}