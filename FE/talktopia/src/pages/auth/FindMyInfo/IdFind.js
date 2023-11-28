import { useState } from "react";
import { BACKEND_URL } from "../../../utils";
import { useNavigate } from "react-router-dom";
import style from "./IdFind.module.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { reduxFindMyInfo } from "../../../store.js";
import { useTranslation } from "react-i18next";
function IdFind() {
    const headers ={
        'Content-Type' : 'application/json'
    }
    const { t } = useTranslation();
    let navigate = useNavigate();
    let dispatch = useDispatch();

    const [userName, setUserName] = useState("");
    const [userEmailPrefix, setUserEmailPrefix] = useState("");
    const [userEmailDomain, setUserEmailDomain] = useState("default");
    const [userEmail, setUserEmail] = useState("");
    const [emailSelect, setEmailSelect] = useState(true);

    

    //모두 입력되었을 때만 찾을 수 있어요
    const [userNameCorrect, setUserNameCorrect] = useState(false);
    const [userEmailCorrect, setUserEmailCorrect] = useState(false);

    const onNameHandler = (e) => {
      setUserName(e.target.value);
      if(e.target.value.length !== 0){
        setUserNameCorrect(true);
      }else{
          setUserNameCorrect(false);
    }
    };

    const onEmailPrefixHandler = (e) => {
      setUserEmailPrefix(e.target.value);
      setUserEmail(`${e.target.value}@${userEmailDomain}`);
      if(userEmailDomain !== "default" && userEmailDomain.length !== 0 && e.target.value.length !== 0){
        setUserEmailCorrect(true);
      }
    };

    const onEmailDomainHandler = (e) => {
      setUserEmailDomain(e.target.value);

      const em = e.target.value;
      setEmailSelect(
        em === "gmail.com" ||
        em === "hotmail.com" ||
        em === "outlook.com" ||
        em === "yahoo.com" ||
        em === "icloud.com" ||
        em === "naver.com" ||
        em === "daum.net" ||
        em === "nate.com" ||
        em === "hanmail.com"
      );

      setUserEmail(`${userEmailPrefix}@${e.target.value}`);

      if(e.target.value !== "default" && e.target.value.length !== 0 && userEmailPrefix.length !== 0){
        setUserEmailCorrect(true);
      }
    };

    const findId = () => {
      const requestBody = {
        userName,
        userEmail,
      };
      const requestBodyJSON = JSON.stringify(requestBody);

      console.log(requestBodyJSON);

      if(userNameCorrect && userEmailCorrect){
        axios
        .post(`${BACKEND_URL}/api/v1/user/searchId`, requestBodyJSON, { headers })
        .then((response) => {

          const modified = response.data.userId.slice(0, -2) + "**";

          dispatch(reduxFindMyInfo({
            userName: userName,
            userEmail: modified,
          }));
          navigate('/findId/success');
        })
        .catch((error) => {
          navigate('/findId/fail');
        });
      }else{
        Swal.fire({
          icon: "warning",
          title: t(`IdFind.IdFind1`),
          confirmButtonText: t(`IdFind.IdFind2`),
          confirmButtonColor: '#90dbf4',
          timer: 2000,
          timerProgressBar: true,
      })
      }
    };

    const onCheckEnter = (e) => {
      if(e.key === 'Enter') {
          console.log("들어오니")
          findId();
      }
    }


    return (
      <>
        <div className={`${style.background}`}>
          <h2 className={`${style.logo}`}>TalkTopia</h2>
          <h2 className={`${style.title}`}>{t(`IdFind.IdFind3`)}</h2>
          <div className={`${style["img-container"]}`}>
            <img className={`${style["fade-in-box"]}`} src="/img/find1.png" alt=""></img>
            <img className={`${style["fade-in-box-1"]}`} src="/img/find2.png" alt=""></img>
          </div>
          <p className={`${style.p}`}>{t(`IdFind.IdFind4`)}</p>
          <div className={`${style["parent-container"]}`}>
            <input className={`${style.input}`} type="text" value={userName} onChange={onNameHandler} placeholder={t(`IdFind.IdFind7`)} onKeyPress={onCheckEnter}></input>
            <br/>
            <input className={`${style["input-email"]}`} type="text" value={userEmailPrefix} onChange={onEmailPrefixHandler} placeholder={t(`IdFind.IdFind8`)}></input>
            <span className={`${style["input-email-1"]}`}>@</span>
            {emailSelect === true ? (
              <select className={`${style["input-email-2"]}`} value={userEmailDomain} onChange={onEmailDomainHandler} onKeyPress={onCheckEnter}>
                <option value="default" disabled> {t(`IdFind.IdFind5`)} </option>
                <option value="">{t(`IdFind.IdFind6`)}</option>
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
            ) : (
              <>
                <input className={`${style["input-email"]}`} type="text" value={userEmailDomain} onChange={onEmailDomainHandler} onKeyPress={onCheckEnter}></input>
                <span className={`${style.span}`} onClick={() => {setEmailSelect(true); setUserEmailDomain("default") }}>✖</span>
              </>
            )}
            <button className={`${style.button}`} onClick={findId}>{t(`IdFind.IdFind3`)}</button>
          </div>
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
       </>
       );
      }

export default IdFind;