import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../utils";
import { removeCookie } from "../../cookie";
import { useTranslation } from "react-i18next";
import style from './Nav.module.css';

function User(){
    const navigate = useNavigate();
    const { t } = useTranslation();
    const user = useSelector((state) => state.userInfo);
    const [userName, setUserName] = useState("");
    const [userImg, setUserImg] = useState("");
    const [userLang, setUserLang] = useState("");

    const [userModalVisible, setUserModalVisible] = useState(false);

    useEffect(() => {
        const userInfoString = localStorage.getItem("UserInfo");
        const userInfo = JSON.parse(userInfoString);
        setUserName(userInfo.userName);
        setUserImg(userInfo.profileUrl);

        const lang = userInfo.sttLang;

        if(lang === `ko-KR`){
            setUserLang( t(`UserSet.lang1`));
        }else if(lang === `en-US`){
            setUserLang(t(`UserSet.lang2`));
        }else if(lang === `de-DE`){
            setUserLang(t(`UserSet.lang3`));
        }else if(lang === `ru-RU`){
            setUserLang(t(`UserSet.lang4`));
        }else if(lang === `es-ES`){
            setUserLang(t(`UserSet.lang5`));
        }else if(lang === `it-IT`){
            setUserLang(t(`UserSet.lang6`));
        }else if(lang === `id-ID`){
            setUserLang(t(`UserSet.lang7`));
        }else if(lang === `ja-JP`){
            setUserLang(t(`UserSet.lang8`));
        }else if(lang === `fr-FR`){
            setUserLang(t(`UserSet.lang9`));
        }else if(lang === `zh-CN`){
            setUserLang(t(`UserSet.lang10`));
        }else if(lang === `zh-TW`){
            setUserLang(t(`UserSet.lang11`));
        }else if(lang === `pt-PT`){
            setUserLang(t(`UserSet.lang12`));
        }else if(lang === `th-TH`){
            setUserLang(t(`UserSet.lang13`));
        }
    }, []);

        console.log(userName.length);
        const determineFontSize = () => {
            if (userName.length >= 20) {
                return '13px';
              } else if (userName.length >= 10) {
                return '15px';
              } else {
                return '23px';
            }
        }
        determineFontSize();


    const handleUserMouseOver = () => {
        setUserModalVisible(true);
      };
    
      const handleUserMouseOut = () => {
        setUserModalVisible(false);
      };
    

    //로그아웃
    const logout = () => {
        const userInfoString = localStorage.getItem("UserInfo");
        const userInfo = JSON.parse(userInfoString);
        console.log(user.userId, "아이디 나오니")
        axios.get(`${BACKEND_URL}/api/v1/user/logout/${userInfo.userId}`, {
            params: {
                name: userInfo.userId 
            },
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userInfo.accessToken}`
            }
          }).then((response)=>{
            removeCookie('refreshToken');
            localStorage.removeItem("UserInfo");
            console.log("로그아웃");
            
            navigate('/logout');
         })
         .catch((error)=>{
             console.log("로그아웃 실패", error);
         })
    }


    return(
        <div className={`${style["user-space"]}`} onMouseOver={handleUserMouseOver} onMouseOut={handleUserMouseOut}>
            <img className={`${style.user}`} src="/img/nav/user.png" alt="" onMouseOver={handleUserMouseOver} onMouseOut={handleUserMouseOut}></img>
                {
                userModalVisible &&
                    <div onMouseOver={handleUserMouseOver} onMouseOut={handleUserMouseOut}>
                        <div className={`${style.meModal}`}>
                            <img className={`${style.img}`} style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden'}} src={userImg} alt=""/>
                            <p className={`${style.mytext}`} style={{ fontSize: determineFontSize() }}>{userName}</p>
                            <p className={`${style.mytext}`}>{t(`UserSet.lang14`)}{userLang}</p>
                            <hr/>
                            <p className={`${style.mytext}`} onClick={()=>{navigate('/myinfo/passwordConfirm')}}>{t(`UserSet.lang15`)}</p>
                            <p className={`${style.mytext}`} onClick={logout}>{t(`UserSet.lang16`)}</p>
                        </div>
                    </div>
                }
        </div>
    )
}

export default User;