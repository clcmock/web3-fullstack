import React from "react";
import style from './index.module.scss';
import icon from './img/icon.png';
import activeIcon from './img/active.png';
import termintedIcon from './img/terminated.png';
import suspendedIcon from './img/suspended.png';

export interface OracleCardProps {
  id: string;
  coinName: string;
  coinLogo?: string;
  status: number;
  cointPrice?: string;
  expiryDate: string;
  isSelectd?: boolean;
  onClick: (id: string) => void;
}

export function OracleCard(props: OracleCardProps) {

  return (
    <div className={'flex flex-row ' + style['oracle-card'] + ' ' + (props.isSelectd ? style['select'] : '')}
      onClick={(e) => {
        e.stopPropagation();
        props.onClick(props.id);
      }}
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
          <div className={style['amount']}>$ {props.cointPrice}</div>
          <div className={style['time']}>End: {props.expiryDate}</div>
        </div>  
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className={'flex flex-row ' + style['oracle-card'] + ' ' + style['skeleton-card']}>
      <div className={'flex flex-col justify-between ' + style['card-left']}>
        <div className={style['loading-item']}></div>
        <div className={style['loading-item']}></div>
        <div className={style['loading-item']}></div>
      </div>
      <div className={ 'flex flex-col justify-between flex-1 ' + style['card-right']}>
        <div className={style['loading-item']} style={{opacity: 0}}></div>
        <div className={style['loading-item']}></div>
        <div className={style['loading-item']}></div>
      </div>
    </div>
  );
}