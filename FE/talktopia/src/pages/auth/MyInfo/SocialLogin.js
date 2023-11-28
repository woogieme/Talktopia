import { useEffect, useState } from 'react';
import style from './SocialLogin.module.css';
import axios from 'axios';
import { BACKEND_URL } from '../../../utils';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { reduxUserInfo } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
function SocialLogin(){
    const user = useSelector((state) => state.userInfo);
    const { t } = useTranslation();
    const navigate = useNavigate();
    let dispatch = useDispatch();

    const headers = {
        'Content-Type' : 'application/json',
        'Authorization': `Bearer ${user.accessToken}`
    }
    
    const [userLan, setUserLan] = useState("");
    const [userLanCorrect, setUserLanCorrect] = useState(false);

    useEffect(() => {
        // 로컬 스토리지에서 저장된 사용자 정보 불러오기
        const storedUserInfo = localStorage.getItem('UserInfo');
        if (storedUserInfo) {
          const userInfo = JSON.parse(storedUserInfo);
          // Redux 상태를 업데이트하는 액션 디스패치
          dispatch(reduxUserInfo(userInfo));
        }
    }, [user]);

    const onLanHandler = (e) => {
        setUserLan(e.target.value);
        if(e.target.value.length !== 0){
            setUserLanCorrect(true);
        }
    }

    const regist = (e) => {
        if(!userLanCorrect){
            Swal.fire({
                icon: "warning",
                title:  t(`SocialLogin.SocialLoginmsg1`),
                confirmButtonText: t(`SocialLogin.SocialLoginmsg2`),
                confirmButtonColor: '#90dbf4',
                timer: 2000,
                timerProgressBar: true,
              });
        }else{
            const requestBody = {
                userId: user.userId,
                userLan: userLan
            }
            const requestBodyJSON = JSON.stringify(requestBody);

            console.log(requestBodyJSON);

            axios
            .put(`${BACKEND_URL}/api/v1/social/putLang`, requestBodyJSON, {headers})
            .then((response) => {
                console.log(response);
                console.log(response.data);
                dispatch(reduxUserInfo({ ...user, sttLang: userLan, transLang: response.data}));
                const userInfoJSON = localStorage.getItem("UserInfo");

                if (userInfoJSON) {
                  // JSON 문자열을 객체로 변환
                  const userInfo = JSON.parse(userInfoJSON);
                
                  // sttLang 값을 변경하고 싶은 userLan 값으로 업데이트
                  const newUserInfo = {
                    ...userInfo,
                    sttLang: userLan,
                    transLang: response.data
                  };
                  localStorage.setItem("UserInfo", JSON.stringify(newUserInfo));

                Swal.fire({
                    icon: "success",
                    title: t(`SocialLogin.SocialLoginmsg3`),
                    text: t(`SocialLogin.SocialLoginmsg4`),
                    confirmButtonText: t(`SocialLogin.SocialLoginmsg5`),
                    confirmButtonColor: '#90dbf4',
                    timer: 2000,
                    timerProgressBar: true,
                  }).then(
                      navigate('/home')
                  )
                }
            }).catch((error)=>{
                Swal.fire({
                    icon: "fail",
                    title: "올바르지 않은 접근입니다.",
                    confirmButtonText: "확인",
                    confirmButtonColor: '#90dbf4',
                  })
            })
        }
    }

    return(
        <div className={`${style.background}`}>
            <h2 className={`${style.logo}`}>TalkTopia</h2>
            <h2 className={`${style.title}`}>{t(`SocialLogin.SocialLoginmsg8`)}</h2>
            <p className={`${style.p}`}>{t(`SocialLogin.SocialLoginmsg9`)} </p>
            <p className={`${style.p}`}>{t(`SocialLogin.SocialLoginmsg10`)}</p>
            <p className={`${style.p}`}>{t(`SocialLogin.SocialLoginmsg11`)}</p>
            <div className={style["div-join-container"]}>
                <div className={style["div-join"]}>
                    <span className={`${style["span-join"]}`}>{t(`SocialLogin.Socialmsg1`)} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <select className={`${style.selectLan} ${style.input}`} value={userLan} onChange={onLanHandler}>
                        <option value="" disabled>{t(`SocialLogin.Socialmsg2`)}</option>
                        <option value="ko-KR">{t(`SocialLogin.Socialmsg3`)}</option>
                        <option value="de-DE">{t(`SocialLogin.Socialmsg4`)}</option>
                        <option value="ru-RU">{t(`SocialLogin.Socialmsg5`)}</option>
                        <option value="es-ES">{t(`SocialLogin.Socialmsg6`)}</option>
                        <option value="en-US">{t(`SocialLogin.Socialmsg7`)}</option>
                        <option value="it-IT">{t(`SocialLogin.Socialmsg8`)}</option>
                        <option value="id-ID">{t(`SocialLogin.Socialmsg9`)}</option>
                        <option value="ja-JP">{t(`SocialLogin.Socialmsg10`)}</option>
                        <option value="fr-FR">{t(`SocialLogin.Socialmsg11`)}</option>
                        <option value="pt-PT">{t(`SocialLogin.Socialmsg12`)}</option>
                        <option value="zh-CN">{t(`SocialLogin.Socialmsg13`)} </option>
                        <option valye="pt-TW">{t(`SocialLogin.Socialmsg14`)} </option>
                        <option value="hi-IN">{t(`SocialLogin.Socialmsg15`)}</option>
                    </select>
                </div>
            </div>
            <button className={`${style.button}`} onClick={regist}>{t(`SocialLogin.Success`)}</button>
            <img className={`${style.turtle}`} src="/img/fish/turtle.png" alt=""></img>
            <img className={`${style.grass2}`} src="/img/grass/grass2.png" alt=""></img>
            <img className={`${style.grass5}`} src="/img/grass/grass5.png" alt=""></img>
            <img className={`${style.fish4}`} src="/img/fish/fish4.png" alt=""></img>
            <img className={`${style.fish33}`} src="/img/fish/fish33.png" alt=""></img>
            <img className={`${style.fish34}`} src="/img/fish/fish34.png" alt=""></img>
            <img className={`${style.friend14}`} src="/img/fish/friend14.png" alt=""></img>
            <img className={`${style.bubble1}`} src="/img/bubble/bubble1.png" alt=""></img>
            <img className={`${style.bubble2}`} src="/img/bubble/bubble2.png" alt=""></img>
            <img className={`${style.bubble3}`} src="/img/bubble/bubble3.png" alt=""></img>
        </div>
    )
}

export default SocialLogin;