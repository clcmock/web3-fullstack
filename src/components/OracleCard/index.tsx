import React, { useState } from "react";
import style from './index.module.scss';
import icon from './img/icon.png';
import activeIcon from './img/active.png';
import termintedIcon from './img/terminated.png';
import suspendedIcon from './img/suspended.png';

export interface OracleCardProps {
  coinName: string;
  coinLogo?: string;
  status: number;
  cointPrice?: string;
  expiryDate: string;
}

export function OracleCard(props: OracleCardProps) {
  const [isHover, setIsHover] = useState(false);

  return (
    <div className={'flex flex-row ' + style['oracle-card']}
    >
      <div className={'flex flex-col justify-between ' + style['card-left']}>
        <div className={style['top']}>{props.coinName}</div>
        <div className={'flex items-center justify-center flex-1'}>
          <img src={props.coinLogo ?? icon} alt="" />
        </div>
      </div>
      <div className={ 'flex flex-col justify-between flex-1 ' + style['card-right']}>
        <div className={'text-right flex items-center justify-end ' + style['top']}>
          <img className={style['statuc-icon']}
            src={ props.status === 1 ? activeIcon : (props.status === 2 ? termintedIcon : suspendedIcon) } alt="" />
          {
            props.status === 1 
            ?
            <span className={style['active']}>Active</span> 
            : (props.status === 2
            ? <span className={style['terminted']}>Terminted</span>
            : <span className={style['suspended']}>Suspended</span> ) 
          }
          
        </div>
        <div className={'flex items-center flex-col justify-center flex-1 text-right'}>
          <div className={style['amount']}>$ 3,412,025.12</div>
          <div className={style['time']}>End: 08/Sept/2022 16:00</div>
        </div>  
      </div>
    </div>
  );
}