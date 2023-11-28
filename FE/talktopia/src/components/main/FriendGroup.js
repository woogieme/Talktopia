import React, { useEffect, useState } from 'react';
import style from './mainComponent.module.css';
import { BACKEND_URL } from '../../utils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { reduxUserInfo } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
const FriendGroup = () => {
  const user = useSelector((state) => state.userInfo);
  const { t } = useTranslation();
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

  const enterFriendRoom = async (e) => {
    const requestBody = {
        userId: user.userId,
        vr_max_cnt: e
    };

    const requestBodyJSON = JSON.stringify(requestBody);
    await axios
    .post(`${BACKEND_URL}/api/v1/room/enterFriend`, requestBodyJSON, {headers})
    .then((response) => {
        console.log(response.data.token)
        navigate('/joinroom', {
            state: {
                mySessionId: response.data.vrSession,
                token: response.data.token,
                roomRole: response.data.roomRole,
                allRoomRoles: response.data.showAllVRoomRes,
                roomType: 'friend'
            }
        });
    })
    .catch((error) => {
        console.log("에러 발생", error);
    })
};


  return (
    <>
    <div className={style.friendGroup} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      <div className={style.nimoContainer}>
      <div className={`${style.nimo} ${style.tooltipContainer}`}>
      </div>
      </div>
      <div className={style.doriContainer}>
        <div className={`${style.dori} ${style.tooltipContainer}`}>
          {
            join ?
          <div className={`${style["speech-bubble1"]}`}>
             <p className={`${style.message}`}>{t(`FriendGroup.ment1`)}</p>
            <button className={`${style.button}`} onClick={()=>{enterFriendRoom(6)}}>{t(`FriendGroup.ment2`)}</button>
          </div>
            :
            null
          }
        </div>
      </div>
    </div>
  </> 
  );
};

export default FriendGroup;
