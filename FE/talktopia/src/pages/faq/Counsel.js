import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostList from '../../components/faq/PostList'; 
import style from './Counsel.module.css';
import Nav from '../../nav/Nav';
import { useDispatch, useSelector } from 'react-redux';
import { reduxUserInfo } from '../../store';
import useTokenValidation from '../../utils/useTokenValidation';
import { useTranslation } from "react-i18next";
function OneToOneInquiry() {
  useTokenValidation();
  const { t } = useTranslation();
  const navigate = useNavigate();

  let dispatch = useDispatch();
  const user = useSelector((state) => state.userInfo);

  const [userId, setUserId] = useState("");
  const [userAccessToken, setUserAccessToken] = useState("");


  // const [userInfo, setUserInfo] = useState("");

  useEffect(() => {
    const userInfoString = localStorage.getItem("UserInfo");
    const userInfo = JSON.parse(userInfoString);
    setUserId(userInfo.userId);
    setUserAccessToken(userInfo.userAccessToken);
    dispatch(reduxUserInfo(userInfo));
}, []);


  return (
    <div className={`${style.background}`}>
      <Nav/>
        <div className={`${style.page}`}>
          <h2 className={`${style.title}`}>{t(`Counsel.realcoun1`)}</h2>
            <div className={`${style.categoryGroup}`}>
              <span className={`${style.category}`} onClick={()=>{navigate('/faq')}}>FAQ</span>
              <span className={`${style.category}`} onClick={()=>{navigate('/counsel')}}>{t(`Counsel.realcoun2`)}</span>
            </div>
            <PostList />
            <button className={`${style.button}`} onClick={()=>{navigate('/inquiry')}}>{t(`Counsel.realcoun3`)}</button>
        </div>
        <img className={`${style.grass1}`} src="/img/grass/grass2.png" alt=""></img>
        <img className={`${style.grass5}`} src="/img/grass/grass5.png" alt=""></img>
        <img className={`${style.fish7}`} src="/img/fish/fish7.png" alt=""></img>
        <img className={`${style.fish6}`} src="/img/fish/fish6.png" alt=""></img>
        <img className={`${style.bubble1}`} src="/img/bubble/bubble1.png" alt=""></img>
        <img className={`${style.bubble2}`} src="/img/bubble/bubble2.png" alt=""></img>
        <img className={`${style.bubble3}`} src="/img/bubble/bubble3.png" alt=""></img>
    </div>
  );
}

export default OneToOneInquiry;
