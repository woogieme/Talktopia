import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../../utils";
// import { clientId } from "../../../utils";
import { useDispatch, useSelector } from "react-redux";
import { reduxUserInfo } from "../../../store.js";
// import {gapi} from 'gapi-script';
import axios from "axios";

import Swal from "sweetalert2";
import style from "./JoinLogin.module.scss";
import { setCookie } from "../../../cookie";
import { motion } from "framer-motion";

import {GoogleLogin} from "@react-oauth/google";
import {GoogleOAuthProvider} from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { useTranslation } from "react-i18next";
import ServiceWorkerListener from '../fcm/ServiceWorkerListener';
import getFCMToken from '../fcm/getToken';
import sendTokenToServer from '../fcm/sendTokenToServer';
import NotificationAccordion from '../fcm/NotificationAccordion';

const clientId = '489570255387-1e0n394ptqvja97m2sl6rpf3bta0hjb0.apps.googleusercontent.com'

function JoinLogin(){
    const { t } = useTranslation();
    const headers ={
        'Content-Type' : 'application/json'
    }

    const navigate = useNavigate();

    //redux의 state
    const user = useSelector((state) => state.userInfo);
    let dispatch = useDispatch();

    //입력 받을 아이디, 비밀번호
    const [userId, setUserId] = useState("");
    const [userPw, setUserPw] = useState("");

    //아이디 state값 변경
    const onIdHandler = (e) => {
        setUserId(e.target.value);
    }

    //비밀번호 state값 변경
    const onPwHandler = (e) => {
        setUserPw(e.target.value);
    }

    //로그인 버튼 클릭 시
    const onLogin = async (e) => {
        // e.preventDefault();

        const requestBody = {
            userId,
            userPw
        };

        const requestBodyJSON = JSON.stringify(requestBody);

        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/login`, requestBodyJSON, {headers});
            console.log("엥",response);
            dispatch(reduxUserInfo({
              userId: response.data.userId,
              userName: response.data.userName,
              accessToken: response.data.accessToken,
              expiredDate: response.data.expiredDate,
              sttLang: response.data.sttLang,
              transLang: response.data.transLang,
              profileUrl: response.data.profileUrl,
              role: response.data.role,
            }));

            //fcm 토큰 발급
            // const token = await getFCMToken();
            
            // try {
            //     if (token) {
            //     await sendTokenToServer(response.data.userId, token);
            //     dispatch(reduxUserInfo({
            //         fcmToken: token,
            //         }));
            //     }
            // } catch (error) {
            //     console.error("Error initializing FCM:", error);
            // }
            
            //로컬에 저장하기
            const UserInfo = {
                userId: response.data.userId, 
                userName: response.data.userName, 
                accessToken: response.data.accessToken, 
                expiredDate: response.data.expiredDate, 
                sttLang: response.data.sttLang, 
                transLang: response.data.transLang, 
                fcmToken: "", 
                profileUrl: response.data.profileUrl,
                role: response.data.role
            }
            localStorage.setItem("UserInfo", JSON.stringify(UserInfo));

            //쿠키에 저장하기
            setCookie('refreshToken', response.data.refreshToken, {
                path: '/',
                secure: true,
                // maxAge: 3000
              })
        
            await Swal.fire({
              icon: "success",
              title:  t(`JoinLogin.JoinLogin1`),
              text: t(`JoinLogin.JoinLogin2`),
              confirmButtonText:  t(`JoinLogin.JoinLogin3`),
              confirmButtonColor: '#90dbf4',
              timer: 2000,
              timerProgressBar: true,
            });
        
            navigate('/home');
          } catch (error) {
            await Swal.fire({
                icon: "warning",
                title: t(`JoinLogin.JoinLogin4`)+"<br/>"+t(`JoinLogin.JoinLogin0`),
                text:t(`JoinLogin.JoinLogin5`),
                confirmButtonText: t(`JoinLogin.JoinLogin6`),
                confirmButtonColor: '#90dbf4',
                timer: 2000,
                timerProgressBar: true,
              });
            console.log("에러", error);
          }

        console.log(user.userId)
        console.log(user.accessToken)
    }
    ///////////////////////////////////////////////////////////////////////////////////

    //회원가입
    const [userIdJoin, setUserIdJoin] = useState("");
    const [userPwJoin, setUserJoinPw] = useState(''); // pw 담을 state
    const [userPwConfirm, setUserPwConfirm] = useState(''); //확인 pw 담을 state
    const [userName, setUserName] = useState(''); //name 담을 state
    const [userEmailPrefix, setUserEmailPrefix] = useState(''); //email prefix 담을 state
    const [userEmailDomain, setUserEmailDomain] = useState('default'); //email domain 담을 state
    const [userEmail, setUserEmail] = useState(''); //email 형식 담을 state
    const [userLan, setUserLan] = useState(''); //lan 담을 state

    const [pwConfirmMsg, setPwConfirmMsg] = useState(''); //pw 일치 확인 메세지
    const [nameMsg, setNameMsg] = useState(t(`JoinLogin.JoinLogin7`));

    const [idValid, setIdValid] = useState(false);
    const [pwValid, setPwValid] = useState(false);
    const [emailValid, setEmailValid] = useState(false);

    //이메일 인증 확인
    const [emailSelect, setEmailSelect] = useState(true);
    const [emailConfirmWindow, setEmailConfirmWindow] = useState(false);
    const [emailConfirm, setEmailConfirm] = useState("");
    const [emailConfirmServer, setEmailConfirmServer] = useState("");
    const [emailButton, setEmailButton] = useState(t(`JoinLogin.JoinLogin8`));
    const [isButtonDisabled, setButtonDisabled] = useState(false);

    //모든 정보가 입력됐을 때 회원가입 완료
    const [userIdCorrect, setUserIdCorrect] = useState(false);
    const [userPwCorrect, setUserPwCorrect] = useState(false);
    const [userPwConfirmCorrect, setUserPwConfirmCorrect] = useState(false);
    const [userNameCorrect, setUserNameCorrect] = useState(false);
    // eslint-disable-next-line
    const [userEmailCorrect, setUserEmailCorrect] = useState(false);
    const [userLanCorrect, setUserLanCorrect] = useState(false);

   

    //아이디 유효성
    const onIdJoinHandler = (e) => {
        const value = e.target.value;
        setIdValid(false);
        setUserIdJoin(value);
        setUserIdCorrect(false);
        //정규식
        const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?!.*[!@#$%^&*()_+={}[\]:;<>,.?/~\\|-]).{6,12}$/;
        //유효성 검사
        if(regex.test(value)){
            setIdValid(true);
            
        }else{
            setIdValid(false);
        }
    }

    //아이디 중복 확인
    const onCheckId = (e) => {
        e.preventDefault();
        //아이디가 빈 문자일 때
        if(userIdJoin === ""){
            Swal.fire({
                icon: "warning",
                title: t(`JoinLogin.JoinLogin9`),
                // showCancelButton: true,
                confirmButtonText:t(`JoinLogin.JoinLogin10`),
                confirmButtonColor: '#90dbf4',
                // cancelButtonText: "취소",
                timer: 2000,
                timerProgressBar: true,
            })
        }else if(userIdJoin.length !== 0 && idValid){
            axios.get(`${BACKEND_URL}/api/v1/join/existId/${userIdJoin}`)
            .then((response)=>{
                setUserIdCorrect(true);

                Swal.fire({
                    icon: "success",
                    title: t(`JoinLogin.JoinLogin11`),
                    text: `${t(`JoinLogin.JoinLogin12`)}`,
                    confirmButtonColor: '#90dbf4',
                    // confirmButtonText: "확인",
                    timer: 2000,
                    timerProgressBar: true,
                })
            })
            .catch((error)=>{
                Swal.fire({
                    icon: "warning",
                    title: t(`JoinLogin.JoinLogin13`),
                    text: `${t(`JoinLogin.JoinLogin14`)}`,
                    confirmButtonText: t(`JoinLogin.JoinLogin15`),
                    confirmButtonColor: '#90dbf4',
                    timer: 2000,
                    timerProgressBar: true,
                })
            })
        }else{
            Swal.fire({
                icon: "warning",
                title: t(`JoinLogin.JoinLogin16`),
                confirmButtonText: t(`JoinLogin.JoinLogin17`),
                confirmButtonColor: '#90dbf4',
                timer: 2000,
                timerProgressBar: true,
            })
        }
    }

    //비밀번호
    const onPwJoinHandler = (e) => {
        const value = e.target.value;
        setUserJoinPw(value);
        //정규식
        const regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
        //유효성 검사
        if(regex.test(value)){
            setPwValid(true);
            setUserPwCorrect(true);
            console.log("만족");
        }else{
            setPwValid(false);
            setUserPwCorrect(false);
            console.log("불만족")
        }
    }

    //비밀번호 확인
    const onConfirmPwHandler = (e) => {
        setUserPwConfirm(e.target.value);

        if(e.target.value === userPwJoin){
            setPwConfirmMsg(t(`JoinLogin.JoinLogin18`));
            setUserPwConfirmCorrect(true);
        }else{
            setPwConfirmMsg(t(`JoinLogin.JoinLogin19`));
            setUserPwConfirmCorrect(false);
    }}

    //이름
    const onNameHandler = (e) => {
        setUserName(e.target.value);
        if(e.target.value.length !== 0 && !/\s/.test(e.target.value)){
            setUserNameCorrect(true);
            setNameMsg("");
        }else{
            setUserNameCorrect(false);
            setNameMsg(t(`JoinLogin.JoinLogin20`));
        }
    }

    //Prefix 이메일
    const onEmailPrefixHandler = (e) => {
        setUserEmailPrefix(e.target.value);
        setUserEmail(`${e.target.value}@${userEmailDomain}`);
    }

    //Domain 이메일
    const onEmailDomainHandler = (e) => {
        setUserEmailDomain(e.target.value);

        const em = e.target.value;

        if(em === "gmail.com" || em === "hotmail.com" || em === "outlook.com" || em === "yahoo.com" || em === "icloud.com" ||
        em === "naver.com" || em === "daum.net" || em === "nate.com" || em === "hanmail.com"){
            setEmailValid(true);
            setEmailSelect(true);
        }else{
            // setEmailValid(false);
            setEmailSelect(false);
        }
        setUserEmail(`${userEmailPrefix}@${e.target.value}`);
    }

    //이메일 직접 입력 유효성 검사
    const onEmailDomainHandlerCheck = (e) => {
        setUserEmailDomain(e.target.value);
        const value = e.target.value;

        console.log("vaulaklerk", value);

        const regex = /^[a-zA-Z]+\.[a-zA-Z]+$/;

        if(regex.test(value)){
             setEmailValid(true);
        }else{
           setEmailValid(false);
        }
    }

    //이메일 인증코드 입력
    const onEmailVerify = (e) => {
        setEmailConfirm(e.target.value);
    }

    //이메일 인증 확인
    const checkEmail = async (e) => {
        e.preventDefault();
        
        if(userEmailDomain !== "default" && userEmailDomain.length !== 0 && userEmailPrefix.length !== 0 && emailValid && !/\s/.test(userEmailPrefix) && !/\s/.test(userEmailDomain)){
            // setCountdown(180);
            // setEmailButton("전송 완료");
            // setEmailConfirmWindow(true);
            // Swal.fire({
            //     icon: "success",
            //     title: "입력하신 이메일 주소로 <br/> 인증번호가 발송됐습니다.",
            //     confirmButtonText: "확인",
            //     confirmButtonColor: '#90dbf4',
            //     timer: 1500,
            //     timerProgressBar: true,
            // })
            console.log("이메일", userEmail)
    
            await axios
            .get(`${BACKEND_URL}/api/v1/join/checkEmail/${userEmail}`, {headers})
            .then((response) =>{
                console.log(response);
                setCountdown(180);
                setEmailButton(t(`JoinLogin.JoinLogin21`),);
                setEmailConfirmWindow(true);
                Swal.fire({
                    icon: "success",
                    title: t(`JoinLogin.JoinLogin22`)+ <br/>+t(`JoinLogin.JoinLogin01`),
                    confirmButtonText: t(`JoinLogin.JoinLogin23`),
                    confirmButtonColor: '#90dbf4',
                    timer: 1500,
                    timerProgressBar: true,
                })
                setEmailConfirmServer(response.data.message);
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: t(`JoinLogin.JoinLogin24`),
                    confirmButtonText:t(`JoinLogin.JoinLogin25`),
                    confirmButtonColor: '#90dbf4',
                    timer: 1500,
                    timerProgressBar: true,
                })
            console.log("에러 발생", error);
            })
        }else{
            Swal.fire({
                icon: "warning",
                title: t(`JoinLogin.JoinLogin26`),
                text: t(`JoinLogin.JoinLogin27`),
                confirmButtonText: t(`JoinLogin.JoinLogin28`),
                confirmButtonColor: '#90dbf4',
                timer: 2000,
                timerProgressBar: true,
            })
        }
    }

    const checkEmailVerify = (e) => {
        e.preventDefault();

        console.log("입력 인증 번호 ", emailConfirm);
        console.log("서버 인증", emailConfirmServer);

        if(emailConfirm === emailConfirmServer){
            
            setEmailConfirmWindow(false);
            setEmailButton(t(`JoinLogin.JoinLogin29`));
            setButtonDisabled(true);
            setUserEmailCorrect(true);
            Swal.fire({
                icon: "success",
                title: t(`JoinLogin.JoinLogin30`),
                confirmButtonText:t(`JoinLogin.JoinLogin31`),
                confirmButtonColor: '#90dbf4',
                timer: 2000,
                timerProgressBar: true,
            })
            
        }else{
            Swal.fire({
                icon: "warning",
                title: t(`JoinLogin.JoinLogin32`),
                text:  t(`JoinLogin.JoinLogin001`),
                confirmButtonText:  t(`JoinLogin.JoinLogin33`),
                confirmButtonColor: '#90dbf4',
                timer: 2000,
                timerProgressBar: true,
            })
        }
    }

    //이메일 유효시간
    const [countdown, setCountdown] = useState(180);
    useEffect(() => {
        if (countdown > 0) {
          const interval = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1);
          }, 1000);
    
          return () => clearInterval(interval);
        }

        if(countdown === 0){
            setEmailConfirmServer("aeirjalkcaki3jppj3okdkafjflamkfkreijrie");
        }
      }, [countdown]);

    //언어
    const onLanHandler = (e) => {
        setUserLan(e.target.value);
        if(e.target.value.length !== 0){
            setUserLanCorrect(true);
        }
    }

    //가입하기
    const onSingUp = async (e) => {
        e.preventDefault();
     
        //입력한 정보들이 모두 유효할 경우
        if(userIdCorrect && userPwCorrect && userPwConfirmCorrect && userNameCorrect && userEmailCorrect && userLanCorrect){
            try{
                const requestBody = {
                    userId: userIdJoin,
                    userName: userName,
                    userPw: userPwJoin,
                    userEmail: userEmail,
                    // userImgUrl: "test",
                    userLan: userLan,
                };
     
                console.log(requestBody);
     
                const requestBodyJSON = JSON.stringify(requestBody);

                console.log(requestBodyJSON);

                axios
                .post(`${BACKEND_URL}/api/v1/join`, requestBodyJSON, {headers})
                .then((response) => {
                    Swal.fire({
                        icon: "success",
                        title:  t(`JoinLogin.JoinLogin34`),
                        text: ` ${t(`JoinLogin.JoinLogin35`)}`,
                        confirmButtonText:  t(`JoinLogin.JoinLogin36`),
                        timer: 2000,
                        timerProgressBar: true,
                        confirmButtonColor: '#90dbf4',
                    }).then((result) => {
                        setChange(false);
                    });
                })
                .catch((error) => {
                    console.log("에러발생",error);
                })
            }catch(error){
                 console.error("에러 발생",error);
                 alert( t(`JoinLogin.JoinLogin37`));
            }

            //초기화
             setUserIdJoin("");
             setUserJoinPw("");
             setUserPwConfirm("");
             setUserName("");
             setUserEmailPrefix("");
             setUserEmailDomain("default");
             setUserEmail("");
             setUserLan("");
             setPwConfirmMsg("");
             setNameMsg( t(`JoinLogin.JoinLogin38`))
             setEmailButton( t(`JoinLogin.JoinLogin39`));
             setIdValid(false);
             setPwValid(false);
             setEmailValid(false);
             setEmailSelect(true);
             setEmailConfirmWindow(false);
             setEmailConfirm("");
             setEmailConfirmWindow(false);
             setEmailConfirm("");
             setEmailConfirmServer("");
             setButtonDisabled(false);
             setUserIdCorrect(false);
             setUserPwCorrect(false);
             setUserPwConfirmCorrect(false);
             setUserNameCorrect(false);
             setUserEmailCorrect(false);
             setUserLanCorrect(false);

        }else if(!userIdCorrect){
            Swal.fire({
                icon: "warning",
                title:  t(`JoinLogin.JoinLogin40`),
                confirmButtonText:  t(`JoinLogin.JoinLogin41`),
                confirmButtonColor: '#90dbf4',
                timer: 2000,
                timerProgressBar: true,
            })
        }else if(!userPwCorrect || !userPwConfirmCorrect){
            Swal.fire({
                icon: "warning",
                title:  t(`JoinLogin.JoinLogin42`),
                confirmButtonText: t(`JoinLogin.JoinLogin43`),
                confirmButtonColor: '#90dbf4',
                timer: 2000,
                timerProgressBar: true,
            })
        }else if(!userNameCorrect || /\s/.test(userName)){
            Swal.fire({
                icon: "warning",
                title: t(`JoinLogin.JoinLogin44`),
                confirmButtonText: t(`JoinLogin.JoinLogin45`),
                confirmButtonColor: '#90dbf4',
                timer: 2000,
                timerProgressBar: true,
            })
        }else if(!userEmailCorrect){
            Swal.fire({
                icon: "warning",
                title:t(`JoinLogin.JoinLogin46`),
                confirmButtonText: t(`JoinLogin.JoinLogin47`),
                confirmButtonColor: '#90dbf4',
                timer: 2000,
                timerProgressBar: true,
            })
        }else if(!userLanCorrect){
            Swal.fire({
                icon: "warning",
                title: t(`JoinLogin.JoinLogin48`),
                confirmButtonText:t(`JoinLogin.JoinLogin49`),
                confirmButtonColor: '#90dbf4',
                timer: 2000,
                timerProgressBar: true,
            })
        }
    }




    ///////////////////////////////////////////////////////////////////////////////////
    //로그인, 회원가입 체인지
    const [change, setChange] = useState(false);

    const handleToggleSignUp = () => {
        setChange((prevState) => !prevState);
    };

    /////////////////////////////////////////////////////////////////////////////////
    const onCheckEnter = (e) => {
        if(e.key === 'Enter') {
            onLogin();
        }
    }

      return (
        <motion.div
            /* 2. 원하는 애니메이션으로 jsx를 감싸준다 */
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
        >
        <div className={`${style.background}`}>
        <div className={`${style.cont} ${change ? style["s--signup"] : ""}`}>
            {/* sign in start */}
            <div className={`${style["form-signin"]} ${style["sign-in"]}`} >
                <h2 className={`${style["h2-Font"]}`}>{t(`JoinLogin.JoinLogin50`)}</h2>
                <div className={`${style.login}`}>
                
                    <span className={`${style["login-sub"]}`}>{t(`JoinLogin.JoinLogin51`)}</span>
                    <input className={`${style.input}`} type="text" value={userId} onChange={onIdHandler} onKeyPress={onCheckEnter}/>
                </div>
                
                <div className={`${style.login}`}>
                    <span className={`${style["login-sub"]}`}>{t(`JoinLogin.JoinLogin52`)}</span>
                    <input className={`${style.input}`} type="password" value={userPw} onChange={onPwHandler} onKeyPress={onCheckEnter}/>
                </div>
                
                <button type="button" className={`${style["submit-login"]} ${style["submit"]}`} onClick={onLogin}>{t(`JoinLogin.JoinLogin53`)}</button>
                {/* <button></button> */}
                <div className={`${style.line}`}>{t(`JoinLogin.JoinLogin54`)}</div>
                <div  className={`${style.google}`}>
                <GoogleOAuthProvider clientId={clientId}>
                <GoogleLogin
                    onSuccess={(res) => {
                        const decodeJwt = jwtDecode(res.credential);

                        const headers = {
                            'Content-Type': 'application/json'
                          };
                      
                          const requestBody = {
                            userEmail: decodeJwt.email,
                            userName: decodeJwt.name,
                            userId: decodeJwt.sub
                          };
                      
                          const requestBodyJSON = JSON.stringify(requestBody);
                        //   console.log(requestBodyJSON);
                      
                          axios.post(`https://talktopia.site:10001/api/v1/social/google`, requestBodyJSON, { headers })
                            .then(function (response) {
                              console.log(response);
                              console.log(response.data.sttLang);

                              dispatch(reduxUserInfo({
                                userId: response.data.userId,
                                userName: response.data.userName,
                                accessToken: response.data.accessToken,
                                expiredDate: response.data.expiredDate,
                                sttLang: response.data.sttLang,
                                transLang: response.data.transLang,
                                profileUrl: response.data.profileUrl,
                                role: response.data.role,
                              }));

                              //로컬에 저장하기
                              const UserInfo = { 
                                userId: response.data.userId, 
                                userName: response.data.userName, 
                                accessToken: response.data.accessToken, 
                                expiredDate: response.data.expiredDate, 
                                sttLang: response.data.sttLang, 
                                transLang: response.data.transLang,
                                profileUrl: response.data.profileUrl,
                                role: response.data.role
                            }
                              localStorage.setItem("UserInfo", JSON.stringify(UserInfo));
                  
                              //쿠키에 저장하기
                              setCookie('refreshToken', response.data.refreshToken, {
                                  path: '/',
                                  secure: true,
                                  // maxAge: 3000
                                })

                              if(response.data.sttLang === null){
                                navigate('/snsRegist');
                              }else{
                                Swal.fire({
                                    icon: "success",
                                    title: t(`JoinLogin.JoinLogin55`),
                                    text: t(`JoinLogin.JoinLogin56`),
                                    confirmButtonText:t(`JoinLogin.JoinLogin57`),
                                    confirmButtonColor: '#90dbf4',
                                    timer: 2000,
                                    timerProgressBar: true,
                                  }).then(() => {
                                    navigate('/home');
                                  });
                              }
                            }).catch(function (error) {
                                console.log("너니")
                                console.log(error);
                            });
                    }}
                    onFailure={(err) => {
                        console.log(err);
                    }}
                />
                </GoogleOAuthProvider>

                {/* image 영역 시작 */}
                <img className={`${style.fish1}`} src="/img/fish/fish1.png" alt=""></img>
                <img className={`${style.fish2}`} src="/img/fish/fish2.png" alt=""></img>
                <img className={`${style.fish3}`} src="/img/fish/fish3.png" alt=""></img>
                <img className={`${style.bubble1}`} src="/img/bubble/bubble3.png" alt=""></img>
                <img className={`${style.bubble2}`} src="/img/bubble/bubble2.png" alt=""></img>
                <img className={`${style.bubble4}`} src="/img/bubble/bubble3.png" alt=""></img>
                <img className={`${style.bubble5}`} src="/img/bubble/bubble1.png" alt=""></img>
                <img className={`${style.bubble6}`} src="/img/bubble/bubble2.png" alt=""></img>
                {/* image영역 끝 */}
                
                </div>
                {/* <button type="button" className={`${style["ka-btn"]}`}><span>카카오톡</span>으로 로그인</button> */}

                <div className={`${style["find-area"]}`}>
                    <span className={style["forgot-pass"]} onClick={()=>{navigate('/findId')}}>{t(`JoinLogin.JoinLogin58`)}</span>
                    <span></span>
                    <span className={style["forgot-pass"]} onClick={()=>{navigate('/findPassword')}}>{t(`JoinLogin.JoinLogin59`)}</span>
                </div>
            </div>
            {/* sign in end */}



            {/* 옆에 있는 사진 영역 시작 */}
            <div className={style.img}>
                <div className={`${style["img__text"]} ${style["m--up"]}`}>
                    <h2 className={`${style["h2-Font"]}`}>{t(`JoinLogin.JoinLogin60`)}</h2>
                    <p>{t(`JoinLogin.JoinLogin61`)}<br/> {t(`JoinLogin.JoinLogin62`)}</p>
                </div>
                <div className={`${style["img__text"]} ${style["m--in"]}`}>
                    <h2 className={`${style["h2-Font"]}`}>{t(`JoinLogin.JoinLogin63`)}</h2>
                    <p>{t(`JoinLogin.JoinLogin64`)} <br/> {t(`JoinLogin.JoinLogin65`)}</p>
                </div>
                <div className={style["img__btn"]} onClick={handleToggleSignUp}>
                    <span className={`${style["m--up"]} ${change ? style.active : ""}`}>{t(`JoinLogin.JoinLogin66`)}</span>
                    <span className={`${style["m--in"]} ${change ? "" : style.active}`}>{t(`JoinLogin.JoinLogin67`)}</span>
                </div>
            </div>
            {/* 옆에 있는 사진 영역 끝 */}



            {/* 회원가입 영역 시작 */}
            <div className={style["sub-cont"]}>


                <h2 className={`${style["h2-Join"]}`}>{t(`JoinLogin.JoinLogin68`)} <br/> {t(`JoinLogin.JoinLogin69`)}</h2>
                <div className={`${style["form-signup"]}`}>
                    <div className={style["div-join-container-isButton"]}>
                        <div className={style["div-join"]}>
                            <span className={`${style["span-join"]}`}>{t(`JoinLogin.JoinLogin70`)} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <input type="text" value={userIdJoin} onChange={onIdJoinHandler} className={style["div-input"]}></input>
                            <button className={`${style.buttonId}`} onClick={onCheckId} >{t(`JoinLogin.JoinLogin71`)}</button>
                        </div>
                    </div>
                    <div className={style["div-join-error"]}>
                        <div className={`${style["div-join-error-1"]}`}></div>
                        {
                            !idValid && userIdJoin.length >=0 &&
                            (<div className={`${style["guide"]} ${style["div-join-error2"]}`}>{t(`JoinLogin.JoinLogin72`)}</div>)
                        }
                        <div className={`${style["div-join-error-3"]}`}></div>
                    </div>
                    <div className={style["div-join-container"]}>
                        <div className={style["div-join"]}>
                            <span className={`${style["span-join"]}`}>{t(`JoinLogin.JoinLogin73`)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <input type="password" value={userPwJoin} onChange={onPwJoinHandler} className={style["div-input"]}></input>
                        </div>
                    </div>
                    <div className={style["div-join-error"]}>
                        <div className={`${style["div-join-error-1"]}`}></div>
                        {
                            !pwValid && userPwJoin.length >=0 &&
                            (<div className={`${style["guide"]} ${style["div-join-error2"]}` }>{t(`JoinLogin.JoinLogin74`)}</div>)
                        }
                        <div className={`${style["div-join-error-3"]}`}></div>
                    </div>


                    <div className={style["div-join-container"]}>
                        <div className={style["div-join"]}>
                            <span className={`${style["span-join"]}`}>{t(`JoinLogin.JoinLogin75`)}</span>
                            <input type="password" value={userPwConfirm} onChange={onConfirmPwHandler} className={style["div-input"]}></input>
                        </div>
                    </div>
                    <div className={`${style["div-join-error"]}`}>
                        <div className={`${style["div-join-error-1"]}`}></div>
                        <div className={`${style["guide-pass"]} ${style["div-join-error2"]} ${userPwConfirmCorrect ? style["guide-pass-correct"] : ""}`}>{pwConfirmMsg}</div>
                        <div className={`${style["div-join-error-3"]}`}></div>
                    </div>



                    <div className={style["div-join-container"]}>
                        <div className={style["div-join"]}>
                            <span className={`${style["span-join"]}`}>{t(`JoinLogin.JoinLogin76`)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <input type="text" value={userName} onChange={onNameHandler} className={style["div-input"]}></input>
                        </div>
                    </div>
                    <div className={[`${userNameCorrect ? "" : style.guide1}`, `${style["div-join-error"]}`].join(" ")}>
                        <div className={`${style["div-join-error-1"]}`}></div>
                        <div className={`${style["div-join-error-2"]}`}>{nameMsg}</div>
                        <div className={`${style["div-join-error-3"]}`}></div>
                    </div>

                    <div className={style["div-join-container-isButton"]}>
                        <div className={style["div-join-email"]}>
                            <span className={`${style["span-join"]}`}>{t(`JoinLogin.JoinLogin77`)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <input type="text" value={userEmailPrefix} onChange={onEmailPrefixHandler} className={`${style["div-input-email"]} ${style["email-input"]}`}></input>
                            <span>@</span>
                            {
                            emailSelect === true ? 
                            <>
                            <select className={`${style["select"]} ${style["select-email"]} ${style["div-input-email"]}`} value={userEmailDomain} onChange={onEmailDomainHandler}>
                                <option value="default" disabled>{t(`JoinLogin.JoinLogin78`)}</option>
                                <option value="">{t(`JoinLogin.JoinLogin79`)}</option>
                                <option value="gmail.com">gmail.com</option>
                                <option value="hotmail.com">hotmail.com</option>
                                <option value="outlook.com">outlook.com</option>
                                <option value="yahoo.com">yahoo.com</option>
                                <option value="icloud.com">icloud.com</option>
                                <option value="naver.com">naver.com</option>
                                <option value="daum.net">daum.net</option>
                                <option value="nate.com">nate.com</option>
                                <option value="hanmail.com">hanmail.com</option>
                            </select>
                            <button onClick={checkEmail} className={`${style.buttonId}`} disabled={isButtonDisabled}>{emailButton}</button><br/>
                            
                            </>
                            :
                            <>
                                <input type="text" value={userEmailDomain} onChange={onEmailDomainHandlerCheck} className={`${style["div-input-email"]}`}></input>
                                <p className={`${style["out-email"]}`} onClick={()=> {setEmailSelect(true); setUserEmailDomain("default")}}>✖</p>
                                <button onClick={checkEmail} className={`${style.buttonId}`}>{emailButton}</button><br/>
                                
                                {/* <p className={`${style.buttonId} ${style["buttonId-1"]}`}>인증 완료</p> */}
                            </>
                            
                        }
                        </div>
                    </div>
                        {
                            emailConfirmWindow === true ?
                            <>
                                {/* <div className={style["div-join-container"]}>
                                    <div className={style["div-join"]}>
                                        <div className={`${style["guide-email"]}`}>이메일로 전송된 인증코드를 입력해주세요.</div>
                                    </div>
                                </div> */}
                                <div className={style["div-join-container-isButton-1"]}>
                                    <div className={`${style["div-join"]} ${style["div-join-email-code"]}`}>
                                        <span className={`${style["span-join"]}`}></span>
                                        <input type="text" value={emailConfirm} onChange={onEmailVerify} className={style["div-input-email-1"]} placeholder={t(`JoinLogin.JoinLogin80`)}></input>
                                        <div>
                                            <button onClick={checkEmailVerify} className={`${style.buttonId}`}>{t(`JoinLogin.JoinLogin81`)}</button>
                                            <button onClick={checkEmail} className={`${style.buttonId}`}>{t(`JoinLogin.JoinLogin002`)}</button>
                                        </div>
                                    </div>
                                </div>
                                {countdown > 0 ? (
                                    <p className={`${style.message}`}>{t(`JoinLogin.JoinLogin82`)} {Math.floor(countdown / 60)}{t(`JoinLogin.JoinLogin83`)} {countdown % 60}{t(`JoinLogin.JoinLogin84`)}</p>
                                ) : (
                                    <p className={`${style.message}`}>{t(`JoinLogin.JoinLogin85`)}</p>
                                )}
                            </>
                            : 
                            null
                        }

                    <div className={style["div-join-container"]}>
                        <div className={style["div-join"]}>
                            <span className={`${style["span-join"]}`}>{t(`JoinLogin.JoinLogin87`)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <select className={`${style.selectLan} ${style["div-input"]}`} value={userLan} onChange={onLanHandler}>
                                <option value="" disabled>{t(`JoinLogin.JoinLogin88`)}</option>
                                <option value="ko-KR">{t(`JoinLogin.JoinLogin89`)}</option>
                                <option value="de-DE">{t(`JoinLogin.JoinLogin90`)}</option>
                                <option value="ru-RU">{t(`JoinLogin.JoinLogin91`)}</option>
                                <option value="es-ES">{t(`JoinLogin.JoinLogin92`)}</option>
                                <option value="en-US">{t(`JoinLogin.JoinLogin93`)}</option>
                                <option value="it-IT">{t(`JoinLogin.JoinLogin94`)}</option>
                                <option value="id-ID">{t(`JoinLogin.JoinLogin95`)}</option>
                                <option value="ja-JP">{t(`JoinLogin.JoinLogin96`)}</option>
                                <option value="fr-FR">{t(`JoinLogin.JoinLogin97`)}</option>
                                <option value="pt-PT">{t(`JoinLogin.JoinLogin98`)}</option>
                                <option value="zh-CN">{t(`JoinLogin.JoinLogin99`)}</option>
                                <option valye="pt-TW">{t(`JoinLogin.JoinLogin100`)}</option>
                                <option value="hi-IN">{t(`JoinLogin.JoinLogin101`)}</option>
                            </select>
                        </div>
                    </div>
                    <button className={`${style["submit-1"]}`} onClick={onSingUp}>{t(`JoinLogin.JoinLogin102`)}</button>

                    <img className={`${style.friend11}`} src="/img/fish/friend11.png" alt=""></img>
                    <img className={`${style.fish6}`} src="/img/fish/fish6.png" alt=""></img>
                    <img className={`${style.fish7}`} src="/img/fish/fish7.png" alt=""></img>
                    <img className={`${style.bubble3}`} src="/img/bubble/bubble3.png" alt=""></img>
                    <img className={`${style.bubble7}`} src="/img/bubble/bubble2.png" alt=""></img>
                    <img className={`${style.bubble8}`} src="/img/bubble/bubble3.png" alt=""></img>
                    </div>
            </div>
            {/* 옆에 있는 사진 영역 끝 */}
        </div>
        </div>
        </motion.div>
      );
      
}

export default JoinLogin;