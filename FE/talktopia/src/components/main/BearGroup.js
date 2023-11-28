import React, { useEffect, useState } from 'react';
import style from './mainComponent.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../utils';
import { reduxUserInfo } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

const BearGroup = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.userInfo);
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   // 로컬 스토리지에서 저장된 사용자 정보 불러오기
  //   const storedUserInfo = localStorage.getItem('UserInfo');
  //   if (storedUserInfo) {
  //     const userInfo = JSON.parse(storedUserInfo);
  //     // Redux 상태를 업데이트하는 액션 디스패치
  //     dispatch(reduxUserInfo(userInfo));
  //   }
  // }, [dispatch]);
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.accessToken}`
  }
  const [join, setJoin] = useState(false);

  const handleMouseOver = () => {
    setJoin(true);
  }

  const handleMouseOut = () => {
    setJoin(false);
  }

  const enterCommonRoom = async (e) => {
    const requestBody = {
      userId: user.userId,
      vr_max_cnt: e
    };

    const requestBodyJSON = JSON.stringify(requestBody);
    await axios
    .post(`${BACKEND_URL}/api/v1/room/enterCommon`, requestBodyJSON, {headers})
    .then((response) => {
        console.log(response.data.token)
        navigate('/joinroom', {
            state: {
                // myUserName: user.userId,
                mySessionId: response.data.vrSession,
                token: response.data.token,
                roomRole: response.data.roomRole,
                allRoomRoles: response.data.showAllVRoomRes,
                roomType: 'common'
            }
        });
    })
    .catch((error) => {
        console.log("에러 발생", error);
    })
  };

  return (
    <div className={style.bearGroup} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      <div className={style.bearContainer1}>
        <div className={`${style.bear} ${style.tooltipContainer}`}>
        </div>
      </div>
      <div className={style.bearContainer2}>
        <div className={`${style.bear} ${style.tooltipContainer}`}>
        </div>
      </div>
      <div className={style.bearContainer3}>
        <div className={`${style.bear} ${style.tooltipContainer}`}>
        </div>
      </div>
      <div className={style.bearContainer4}>
        <div className={`${style.bear} ${style.tooltipContainer}`}>
        {
            join?
          <div className={`${style["speech-bubble3"]}`}>
            <p className={`${style.message}`}>{t(`BearGroup.ment1`)}</p>
            <button className={`${style.button}`} onClick={() => {enterCommonRoom(4)}}>{t(`BearGroup.ment2`)}</button>
          </div>
          :
          null

          }
        </div>
      </div>
    </div>
  );
};

export default BearGroup;
