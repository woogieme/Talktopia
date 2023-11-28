// App.js
import React, { useEffect, useRef, useState } from 'react';
import BearGroup from '../../components/main/BearGroup';
import CoralGroup from '../../components/main/CoralGroup';
import FishGroup from '../../components/main/FishGroup';
import FriendGroup from '../../components/main/FriendGroup';
import FriendList from '../../components/main/FriendList';
import PenguinGroup from '../../components/main/PenguinGroup';
import WaterGroup from '../../components/main/WaterGroup';
import WhaleGroup from '../../components/main/WhaleGroup';
import style from '../../components/main/mainComponent.module.css';
import styles from "./Home.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../utils';
import { removeCookie } from '../../cookie';
import Nav from '../../nav/Nav';
import { reduxUserInfo } from '../../store';

import ServiceWorkerListener from '../auth/fcm/ServiceWorkerListener';
import getFCMToken from '../auth/fcm/getToken';
import sendTokenToServer from '../auth/fcm/sendTokenToServer';
import NotificationAccordion from '../auth/fcm/NotificationAccordion';
import useTokenValidation from '../../utils/useTokenValidation';

import { useTranslation } from "react-i18next";

function Home(){
  useTokenValidation();

  const navigate = useNavigate();
  const { t } = useTranslation();

  const user = useSelector((state) => state.userInfo);
  console.log(user, '0000000000000000000000000000000000');
  let dispatch = useDispatch();

  const [userName, setUserName] = useState("");
  const [userImg, setUserImg] = useState("");


  useEffect(()=>{
    const userInfoString = localStorage.getItem("UserInfo");
    const userInfo = JSON.parse(userInfoString);

    const fcmToken = async () => {
      //fcm 토큰 발급
      const token = await getFCMToken();

      console.log(token, "토큰와?");
  
      try {
        if (token) {
          console.log(token,"여기까지는 와.")
          await sendTokenToServer(userInfo.userId, token);
          dispatch(reduxUserInfo({
              fcmToken: token,
              }));

          const storedUserInfo = localStorage.getItem('UserInfo');
          const userInfoo = JSON.parse(storedUserInfo);
          userInfoo.fcmToken = token;
          localStorage.setItem("UserInfo", JSON.stringify(userInfoo));
        }
      } catch (error) {
          console.error("Error initializing FCM:", error);
      }
    }

    fcmToken();

  },[])



  useEffect(() => {
    // 로컬 스토리지에서 저장된 사용자 정보 불러오기
    const storedUserInfo = localStorage.getItem('UserInfo');
    console.log(storedUserInfo, "로컬에서 가져온것")
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      // Redux 상태를 업데이트하는 액션 디스패치
      dispatch(reduxUserInfo(userInfo));
      console.log(storedUserInfo, "로컬")
    }

    console.log(user, '11111111111111111111111');
  }, [user]);


  // useUnload((e) => {
  //   e.preventDefault();
  //   localStorage.removeItem("UserInfo");
  //   removeCookie('refreshToken');
  // });

  return(
  <div className={`${style.body}`}>
    <Nav/>
    <FishGroup />
    <PenguinGroup />
    <BearGroup />
    <FriendGroup />
    <WhaleGroup />
    <CoralGroup />
    <FriendList />
    <WaterGroup />
    <p className={`${styles.guide}`}> {t(`home.mouse`)} <br/> {t(`home.over`)} </p>
    <img className={`${styles.sign}`} src="/img/main/sign1.png" alt=""></img>
  </div>
  )
};

export default Home;