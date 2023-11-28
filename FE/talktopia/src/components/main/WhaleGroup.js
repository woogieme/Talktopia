import React, { useEffect, useState } from 'react';
import style from './mainComponent.module.css';
import { BACKEND_URL } from '../../utils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

const WhaleGroup = () => {
  const user = useSelector((state) => state.userInfo);
  const navigate = useNavigate();
  const { t } = useTranslation();
  // const userInfoString = localStorage.getItem("UserInfo");
  // const userInfo = JSON.parse(userInfoString);
  
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
    <div className={style.whaleGroup} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      <div className={style.whiteContainer}>
        <div className={style.whitewhale}></div>
        <div className={style.whitewhale2}></div>
      </div>
      <div className={style.blueContainer}>
        <div className={style.bluewhale}></div>
        <div className={style.bluewhale2}></div>
      </div>
      <div className={style.pinkContainer}>
        <div className={style.pinkwhale}></div>
        <div className={style.pinkwhale2}></div>
        {
          join ?
          <div className={`${style["speech-bubble2"]}`}>
             <p className={`${style.message}`}>{t(`WhaleGroup.ment1`)}</p>
            <button className={`${style.button}`} onClick={() => {enterCommonRoom(6)}}>{t(`WhaleGroup.ment2`)}</button>
          </div>
          : null
        }
      </div>
    </div>
  );
};

export default WhaleGroup;
