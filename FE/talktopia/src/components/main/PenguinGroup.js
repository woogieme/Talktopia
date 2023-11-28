import React from 'react';
import style from './mainComponent.module.css';
import { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../utils';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

const PenguinGroup = () => {
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
    <div className={style.penguinGroup} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      <div className={style.peng1Container}>
        <div className={style.peng1}>
          <div className={style.tooltipContainer}/>
        </div>
        <div>
          {join ?
          <div className={`${style["speech-bubble"]}`}>
              <p className={`${style.message}`}>{t(`PenguinGroup.ment1`)}</p>
              <button className={`${style.button}`} onClick={() => {enterCommonRoom(2)}}>{t(`PenguinGroup.ment2`)}</button>
          </div>
          :
          null
        }
        </div>
      </div>
      <div className={style.peng2Container}>
        <div className={style.peng2}>
          {/* <div className={style.tooltipContainer}>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PenguinGroup;
