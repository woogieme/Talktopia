import React, { useEffect } from 'react';
import style from './mainComponent.module.css';

const FishGroup = () => {
  useEffect(() => {
    // FishGroup 관련 액션을 여기에 작성하세요.
  }, []);

  return (
    <div className={style.fishgroup}>
      <div className={style.fishContainer}>
        <div className={style.fish}></div>
      </div>
      <div className={style.fishContainer1}>
        <div className={style.fish1}></div>
      </div>
    </div>
  );
};

export default FishGroup;
