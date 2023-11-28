import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BACKEND_URL } from "../../utils";
import style from "./Myinfo.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useUnload from '../../utils/useUnload';
import Nav from '../../nav/Nav';
import useTokenValidation from "../../utils/useTokenValidation";

function MyInfoPw(){
    useTokenValidation();
    const { t } = useTranslation();
    const user = useSelector((state) => state.userInfo);
    const navigate = useNavigate();
  
    const [userPw,setUserPw] = useState("");
   
  // useUnload((e) => {
  //   // e.preventDefault();
  //   // localStorage.removeItem("UserInfo");
  //   // removeCookie('refreshToken');
  // });

    useEffect(()=>{
      const userLocal = localStorage.getItem("UserInfo");
      const userInfo = JSON.parse(userLocal);

      if(userInfo.userId.charAt(0) === "*"){
        navigate('/myinfo');
      }
    },[]);

    const onUserPwHandle = (e) => {
        setUserPw(e.target.value);
    }


    const confirmPw = () => {
      const userLocal = localStorage.getItem("UserInfo");
      const userInfo = JSON.parse(userLocal);


        axios.post(`${BACKEND_URL}/api/v1/myPage/checkPw`, {
            userId: userInfo.userId,
            userPw: userPw,
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userInfo.accessToken}`,
            },
          })
          .then((response) => {
            if(response.data.message === "비밀번호가 틀렸습니다. 다시 입력해주세요."){
              Swal.fire({
                icon: "warning",
                title: t(`MyInfoPw.notPwEqual`),
                confirmButtonText:  t(`MyInfoPw.confirmButtonText1`),
                confirmButtonColor: '#90dbf4',
                timer: 2000,
                timerProgressBar: true,
            })
            }else{
              navigate('/myinfo');
            }
            console.log("요청 성공", response);
          })
          .catch((error) => {
            console.log("요청 실패", error);
          });
    }

    const onCheckEnter = (e) => {
      if(e.key === 'Enter') {
        confirmPw();
      }
    }

    return(
        <div className={`${style.background1}`}>
          <Nav/>
            <h2 className={`${style.logo}`}>TalkTopia</h2>
            <h2 className={`${style.title}`}>{t(`MyInfoPw.showMyInfo`)}</h2>
            <p className={`${style.p}`}>{t(`MyInfoPw.checkyourPw`)}</p>
            <p className={`${style.p}`}>{t(`MyInfoPw.foryourDetect`)} </p>
            <p className={`${style.p}`}>{t(`MyInfoPw.doMyBest`)}</p>
            <input className={`${style.input22}`} type="password" value={userPw} onChange={onUserPwHandle} placeholder={t(`MyInfoPw.verifyPw`)} onKeyPress={onCheckEnter}></input>
            <button className={`${style.button2}`} onClick={confirmPw}>{t(`MyInfoPw.done`)}</button>
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

export default MyInfoPw;