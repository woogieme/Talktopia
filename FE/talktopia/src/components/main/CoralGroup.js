import React, { useEffect } from 'react';
import style from './mainComponent.module.css';

const CoralGroup = () => {
  useEffect(() => {
    // CoralGroup 관련 액션을 여기에 작성하세요.
  }, []);

  return (
    <div className={style.coralGroup}>
      <div className={style.coralContainer1}>
        <div className={style.coral1}></div>
      </div>
      <div className={style.coralContainer2}>
        <div className={style.coral2}></div>
      </div>
      <div className={style.coralContainer3}>
        <div className={style.coral3}></div>
      </div>
      <div className={style.coralContainer4}>
        <div className={style.coral4}></div>
      </div>
      <div className={style.stoneContainer1}>
        <div className={style.stone1}></div>
      </div>
      <div className={style.stoneContainer2}>
        <div className={style.stone2}></div>
      </div>
      <div className={style.stoneContainer3}>
        <div className={style.stone3}></div>
      </div>
    </div>
  );
};

export default CoralGroup;
