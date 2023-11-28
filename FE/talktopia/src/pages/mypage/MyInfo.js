import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import style from "./Myinfo.module.css";
import { removeCookie } from '../../cookie';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { reduxUserInfo } from "../../store";
import Nav from '../../nav/Nav';
import useTokenValidation from "../../utils/useTokenValidation";
import { useTranslation } from "react-i18next";
function MyInfo(){
    useTokenValidation();
    const { t } = useTranslation();
    const user = useSelector((state) => state.userInfo);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.accessToken}`
    }

    const [userId1, setUserId] = useState("");
    const [userPw, setUserPw] = useState("");
    const [userPwConfirm, setUserPwConfirm] = useState("");
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userImgUrl, setUserImgUrl] = useState("");
    const [userLan, setUserLan] = useState("");
    const [userAccessToken, setUserAccessToken] = useState("");

    const [pwValid, setPwValid] = useState(false);

    const [pwConfirmMsg, setPwConfirmMsg] = useState('');
    const [userPwCorrect, setUserPwCorrect] = useState(false);

    const [googleId, setGoogleId] = useState(false);


    useEffect(()=>{
        const userInfoString = localStorage.getItem("UserInfo");
        const userInfo = JSON.parse(userInfoString);

        setUserAccessToken(userInfo.accessToken);

        const api = `${BACKEND_URL}/api/v1/myPage/${userInfo.userId}`;

        axios.get(api, {
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.accessToken}`
            }
        })
        .then((response)=>{
            setUserId(response.data.userId);
            setUserName(response.data.userName);
            setUserEmail(response.data.userEmail);
            setUserImgUrl(response.data.userProfileImgUrl);
            setUserLan(response.data.userLan);

            if(response.data.userId.charAt(0) === '*'){
                setGoogleId(true);
                console.log(googleId, "구글아이디");
            }

        })
         .catch((error)=>{
             console.log("못 불러옴", error);
         })
    },[]);

    useEffect(() => {
        console.log(googleId, "구글아이디");
      }, [googleId]);
    
    const onPwHandler = (e) => {
        const value = e.target.value;
        setUserPw(value);
        //정규식
        const regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
        //유효성 검사
        if(regex.test(value)){
            setPwValid(true);
        }else{
            setPwValid(false);
        }
    }

    const onPwConfirmHandler = (e) => {
        setUserPwConfirm(e.target.value);

        if(e.target.value === userPw){
            setPwConfirmMsg(t(`MyInfo.setPwConfirmMsg1`));
            setUserPwCorrect(true);
        }else{
            setPwConfirmMsg(t(`MyInfo.setPwConfirmMsg2`));
            setUserPwCorrect(false);
    }}

    const onNameHandler = (e) => {
        setUserName(e.target.value);
    }

    const onLanHandler = (e) => {
        setUserLan(e.target.value);
    }

    const updateMyInfo = () => {
        if(!pwValid){
            Swal.fire({
                icon: "warning",
                title: t(`MyInfo.updateMyInfoPwValid`),
                confirmButtonText:  t(`MyInfo.confirmButtonText1`),
                confirmButtonColor: '#90dbf4',
            })
        }else if(!userPwCorrect){
            Swal.fire({
                icon: "warning",
                title: t(`MyInfo.updateMyInfouserPwCorrect`),
                confirmButtonText:  t(`MyInfo.confirmButtonText2`),
                confirmButtonColor: '#90dbf4',
            })
        }else if(userName.length === 0 || /\s/.test(userName)){
            Swal.fire({
                icon: "warning",
                title: t(`MyInfo.checkyourId`),
                confirmButtonText: t(`MyInfo.confirmButtonText3`),
                confirmButtonColor: '#90dbf4',
            })
        }else{
            axios.put(`${BACKEND_URL}/api/v1/myPage/modify`, {
                userId: userId1,
                userName: userName,
                userPw: userPw,
                userEmail: userEmail,
                userImgUrl: userImgUrl,
                userLan: userLan
              }, 
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${userAccessToken}`,
                },
              })
            .then((response) => {
                console.log(response.data);

                const userInfoString = localStorage.getItem("UserInfo");
                const userInfo = JSON.parse(userInfoString);

                userInfo.userId = userId1;
                userInfo.userName = userName;
                userInfo.userPw = userPw;
                userInfo.profileUrl = userImgUrl;
                userInfo.sttLang = userLan;
                userInfo.transLang = response.data;

                //다시 localStorage에 저장
                localStorage.setItem("UserInfo", JSON.stringify(userInfo));


                Swal.fire({
                    icon: "success",
                    title: t(`MyInfo.ModifySuccess`),
                    confirmButtonText:  t(`MyInfo.confirmButtonText4`),
                    confirmButtonColor: '#90dbf4',
                    // timer: 2000,
                    // timerProgressBar: true,
                }).then(() => {
                    navigate('/home');
                  });
            })
            .catch((error) =>{
                console.log("수정 실패", error);
            })
        }
        
    }

    const leave = () => {
        Swal.fire({
            icon: "warning",
            title: t(`MyInfo.checkLeaveReal`),
            text:t(`MyInfo.checkLeaveRealText`),
            showCancelButton: true,
            confirmButtonText:t(`MyInfo.confirmButtonText5`),
            cancelButtonText:t(`MyInfo.cancelButtonText1`),
            confirmButtonColor: '#90dbf4',
            cancelButtonColor: '#ee5561',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${BACKEND_URL}/api/v1/myPage/leave/${userId1}`, {
                    params: {
                        name: userId1
                    },
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${user.accessToken}`
                    }
                  }).then((response)=>{
                    console.log(response);
                    removeCookie('refreshToken');
                    localStorage.removeItem("UserInfo");
                    
                    console.log("탈퇴");
                    navigate('/bye');
                 })
                 .catch((error)=>{
                     console.log("탈퇴 실패", error);
                 })
            }
        })    
    }


    const [file, setFile] = useState(null);

    const onChangeFiles = (event) => {
        setFile(event.target.files[0]);
        const imageUrl = URL.createObjectURL(event.target.files[0]); // 업로드된 이미지의 URL 생성
        setUserImgUrl(imageUrl);
        console.log(event.target.files[0]);
    };

    const upload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('profile', file);
        console.log(formData);

        try{
            const response = await axios.put(`${BACKEND_URL}/api/v1/myPage/profile/${userId1}`, formData, {
                headers : {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${userAccessToken}`
                },
            });
            setUserImgUrl(response.data.imageUrl);
            console.log("응답 url" , response.data.imageUrl);
            const updatedUserInfo = { ...user, imageUrl: response.data.imageUrl };
            dispatch(reduxUserInfo(updatedUserInfo));

            //로컬에 저장
            const localStorageUserInfo = JSON.parse(localStorage.getItem("UserInfo"));
            localStorageUserInfo.profileUrl = response.data.imageUrl;
            localStorage.setItem("UserInfo", JSON.stringify(localStorageUserInfo));

            Swal.fire({
                icon: "success",
                title: t(`MyInfo.modifyyourImage`),
                confirmButtonText: t(`MyInfo.confirmButtonText6`),
                confirmButtonColor: '#90dbf4',
                timer: 2000,
                timerProgressBar: true,
            })

        }catch(error){
            console.log("에러", error);
        }
    }

    const onCheckEnter = (e) => {
        if(e.key === 'Enter') {
            updateMyInfo();
        }
    }

    const inputClassName = `${googleId ?style["input-1"] : style.input}`;
    
    return(
        <div className={`${style.background}`}>
            <Nav/>
            <h2 className={`${style.title}`}>{t(`MyInfo.modifyMyInfo`)}</h2>
            <div className={`${style.divide}`}>
                <div className={`${style.profile}`}>
                    <img style={{ width: '80px', height: '80px', borderRadius: '50%',
                    overflow: 'hidden'}} src={userImgUrl} alt="프로필 이미지"/>
                    <form>
                        <label for="file">
                        <div className={`${style["btn-upload"]}`}>{t(`MyInfo.fileupload1`)}</div>
                        </label>
                        <input className={`${style["signup-profileImg-label1"]}`} type="file" name="file" id="file"accept="image/*" onChange={onChangeFiles}/>
                        <button className={`${style["signup-profileImg-label"]}`} onClick={upload}>{t(`MyInfo.fileupload2`)}</button>
                    </form>
                    <div className={`${style.together}`}>
                        <div className={`${style.together1}`}>
                        <p className={`${style.p}`}>{t(`MyInfo.modifyId`)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                            <input type="text" value={userId1} className={`${style["input-1"]}`} readOnly></input>
                        </div>
                    </div>
                    <div className={`${style.together}`}>
                    <div className={`${style.together1}`}>
                        <p className={`${style.p}`}>{t(`MyInfo.modifyEmail`)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                        <input type="text" value={userEmail} className={`${style["input-1"]}`} readOnly></input>
                    </div>
                </div>
            </div>
            <div className={`${style.profile}`}>
                <div className={`${style.together}`}>
                    <div className={`${style.together1}`}>
                        <p className={`${style.p}`}>{t(`MyInfo.modifyPW`)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                        {/* <p className={`${style.guide}`}>변경을 원하는 비밀번호를 입력해주세요. <br/> 변경을 원치 않으시다면 기존의 비밀번호를 입력해주세요.</p> */}
                        <input type="password" value={userPw} className={inputClassName} onChange={onPwHandler} onKeyPress={onCheckEnter} readOnly={googleId}></input>
                    </div>
                </div>
                <div className={`${style.guide}`}>{t(`MyInfo.modifyGuide`)}</div>
                <div className={`${style.together}`}>
                    <div className={`${style.together1}`}>
                    <p className={`${style.p}`}>{t(`MyInfo.modifyCheckyourPw`)}&nbsp;</p>
                        <input type="password" value={userPwConfirm} className={inputClassName} onChange={onPwConfirmHandler} onKeyPress={onCheckEnter} readOnly={googleId}></input>
                    </div>
                </div>
                <div>
                    <div className={`${style["guide-pass"]} ${userPwCorrect ? style["guide-pass-correct"] : ""}`}>{pwConfirmMsg}</div>
                </div>
                <div className={`${style.together}`}>
                    <div className={`${style.together1}`}>
                    <p className={`${style.p}`}>{t(`MyInfo.modifyName`)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                        <input type="text" value={userName} className={`${style.input}`} onChange={onNameHandler} onKeyPress={onCheckEnter}></input>
                    </div>
                </div>
                <div className={`${style.guide}`}>{t(`MyInfo.noyAccessSpace`)}</div>
           
                <div className={`${style.together2}`}>
                    <div className={`${style.together1}`}>
                    
                    <p className={`${style.p}`}>{t(`MyInfo.userLanguage`)}&nbsp;&nbsp;&nbsp;</p>
                        <select className={`${style.select}`} value={userLan} onChange={onLanHandler} onKeyPress={onCheckEnter}>
                            <option value="" disabled>{t(`MyInfo.idontknow`)}</option>
                            <option value="ko-KR">{t(`MyInfo.useLanguage1`)}</option>
                            <option value="de-DE">{t(`MyInfo.useLanguage2`)}</option>
                            <option value="ru-RU">{t(`MyInfo.useLanguage3`)}</option>
                            <option value="es-ES">{t(`MyInfo.useLanguage4`)}</option>
                            <option value="en-US">{t(`MyInfo.useLanguage5`)}</option>
                            <option value="it-IT">{t(`MyInfo.useLanguage6`)}</option>
                            <option value="id-ID">{t(`MyInfo.useLanguage7`)}</option>
                            <option value="ja-JP">{t(`MyInfo.useLanguage8`)}</option>
                            <option value="fr-FR">{t(`MyInfo.useLanguage9`)}</option>
                            <option value="pt-PT">{t(`MyInfo.useLanguage10`)}</option>
                            <option value="zh-CN">{t(`MyInfo.useLanguage11`)}</option>
                            <option valye="pt-TW">{t(`MyInfo.useLanguage12`)}</option>
                            <option value="hi-IN">{t(`MyInfo.useLanguage13`)}</option>
                        </select>
                    </div>
                </div>
            </div>
            </div>
            <button className={`${style.button1}`} onClick={leave}>{t(`MyInfo.DeclineUser`)}</button>
            <button className={`${style.button}`} onClick={updateMyInfo}>{t(`MyInfo.Modify`)}</button>
            <img className={`${style.turtle1}`} src="/img/fish/turtle.png" alt=""></img>
            <img className={`${style.grass21}`} src="/img/grass/grass2.png" alt=""></img>
            <img className={`${style.grass51}`} src="/img/grass/grass5.png" alt=""></img>
            <img className={`${style.fish41}`} src="/img/fish/fish4.png" alt=""></img>
            <img className={`${style.fish331}`} src="/img/fish/fish33.png" alt=""></img>
            <img className={`${style.friend141}`} src="/img/fish/friend14.png" alt=""></img>
            <img className={`${style.bubble11}`} src="/img/bubble/bubble1.png" alt=""></img>
            <img className={`${style.bubble21}`} src="/img/bubble/bubble2.png" alt=""></img>
        </div>
    )
}

export default MyInfo;