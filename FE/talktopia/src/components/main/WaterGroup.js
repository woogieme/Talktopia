import React, { useEffect } from 'react';
import style from './mainComponent.module.css';

const WaterGroup = () => {
  // useEffect(() => {
  //   const waterDrops = document.querySelectorAll('.' + style.waterDrop);

  //   function randomDelaynoshow() {
  //     return Math.random() * 2000 + 1000;
  //   }

  //   function randomDelayshow() {
  //     return Math.random() * 6000 + 4000;
  //   }

  //   function randomPosition(element) {
  //     const minMargin = 30;
  //     const maxMarginX = window.innerWidth - element.clientWidth - minMargin;
  //     const maxMarginY = window.innerHeight - element.clientHeight - minMargin;

  //     const randomX = Math.random() * maxMarginX - minMargin;
  //     const randomY = Math.random() * maxMarginY - minMargin;

  //     element.style.left = randomX + 'px';
  //     element.style.top = randomY + 'px';

  //     console.log(randomX, randomY);
  //   }

  //   function toggleVisibility(element) {
  //     if (element.style.display === 'none') {
  //       element.style.display = 'block';
  //     } else {
  //       element.style.display = 'none';
  //     }
  //   }

  //   function manageWaterDrop(element) {
  //     randomPosition(element);
  //     toggleVisibility(element);
  //     setTimeout(() => {
  //       toggleVisibility(element);
  //       setTimeout(() => {
  //         manageWaterDrop(element);
  //       }, randomDelayshow());
  //     }, randomDelaynoshow());
  //   }

  //   waterDrops.forEach(function (drop) {
  //     manageWaterDrop(drop);
  //   });

  //   const crabContainer1s = document.querySelector('.' + style.crabContainer1);
  //   const crabImage = document.querySelector('.' + style.crab);

  //   crabContainer1s.addEventListener('mouseover', () => {
  //     crabImage.style.transform = 'translateY(-100px)';
  //   });

  //   crabContainer1s.addEventListener('mouseout', () => {
  //     crabImage.style.transform = 'translateY(0)';
  //   });
  // }, []);

  return (
    <div className={style.waterGroup}>
      {/* <div className={style.waterDrop + ' ' + style.waterDrop1}></div>
      <div className={style.waterDrop + ' ' + style.waterDrop2}></div>
      <div className={style.waterDrop + ' ' + style.waterDrop3}></div>
      <div className={style.waterDrop + ' ' + style.waterDrop1}></div>
      <div className={style.waterDrop + ' ' + style.waterDrop2}></div>
      <div className={style.waterDrop + ' ' + style.waterDrop3}></div>
      <div className={style.waterDrop + ' ' + style.waterDrop1}></div>
      <div className={style.waterDrop + ' ' + style.waterDrop2}></div> */}
      <div className={style.waterDrop1}></div>
      <div className={style.waterDrop2}></div>
      <div className={style.waterDrop3}></div>
      <div className={style.waterDrop4}></div>
      <div className={style.waterDrop5}></div>
      <div className={style.waterDrop6}></div>
      <div className={style.waterDrop7}></div>
    </div>
  );
};

export default WaterGroup;
