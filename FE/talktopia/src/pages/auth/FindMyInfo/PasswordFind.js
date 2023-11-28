import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../../utils";
import style from "./PasswordFind.module.css";
import { useTranslation } from "react-i18next";
function PasswordFind(){
  const { t } = useTranslation();
    const headers ={
        'Content-Type' : 'application/json',
    }

  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmailPrefix, setUserEmailPrefix] = useState("");
  const [userEmailDomain, setUserEmailDomain] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [emailSelect, setEmailSelect] = useState(true);

  const onIdHandler = (e) => {
    setUserId(e.target.value);
  };

  const onNameHandler = (e) => {
    setUserName(e.target.value);
  };

  const onEmailPrefixHandler = (e) => {
    setUserEmailPrefix(e.target.value);
    setUserEmail(`${e.target.value}@${userEmailDomain}`);
  };

  const onEmailDomainHandler = (e) => {
    setUserEmailDomain(e.target.value);

    const em = e.target.value;
    setEmailSelect(em === "gmail.com" || em === "hotmail.com" || em === "outlook.com" || em === "yahoo.com" || em === "icloud.com" ||
      em === "naver.com" || em === "daum.net" || em === "nate.com" || em === "hanmail.com");

    setUserEmail(`${userEmailPrefix}@${e.target.value}`);
  };

  const findPw = () => {
    const requestBody = {
      userId,
      userName,
      userEmail,
    };
    const requestBodyJSON = JSON.stringify(requestBody);

    console.log(requestBodyJSON);

    axios
      .post(`${BACKEND_URL}/api/v1/user/searchPw`, requestBodyJSON, { headers })
      .then((response) => {
        navigate('/findPassword/success');
        console.log('성공');
        console.log(response);
      })
      .catch((error) => {
        navigate('/findPassword/fail');
        console.log("에러 발생", error);
      });
  };

  const onCheckEnter = (e) => {
    // e.preventDefault();
    if(e.key === 'Enter') {
        findPw();
    }
  }

  
    return(
      <div className={`${style.background}`}>
        <h2 className={`${style.logo}`}>TalkTopia</h2>
        <h2 className={`${style.title}`}>{t(`PasswordFind.PasswordFind1`)}</h2>
        <div className={`${style["img-container"]}`}>
            <img className={`${style["fade-in-box"]}`} src="/img/find1.png" alt=""></img>
            <img className={`${style["fade-in-box-1"]}`} src="/img/find3.png" alt=""></img>
        </div>
        <p className={`${style.p}`}>{t(`PasswordFind.PasswordFind2`)}</p>
        <div className={`${style["parent-container"]}`}>
          <input className={`${style.input}`} type="text" value={userId} onChange={onIdHandler} placeholder={t(`PasswordFind.PasswordFind3`)} onKeyPress={onCheckEnter}></input><br/>
          <input className={`${style.input}`} type="text" value={userName} onChange={onNameHandler} placeholder={t(`PasswordFind.PasswordFind4`)} onKeyPress={onCheckEnter}></input><br/>
          <input className={`${style["input-email"]}`} type="text" value={userEmailPrefix} onChange={onEmailPrefixHandler} placeholder={t(`PasswordFind.PasswordFind4`)}></input>
            <span className={`${style["input-email-1"]}`}>@</span>
            {emailSelect === true ? (
              <select className={`${style["input-email-2"]}`} value={userEmailDomain} onChange={onEmailDomainHandler} onKeyPress={onCheckEnter}>
                <option value="default" disabled> {t(`PasswordFind.PasswordFind6`)} </option>
                <option value="">{t(`PasswordFind.PasswordFind7`)}</option>
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
        <button className={`${style.button}`} onClick={findPw}>{t(`PasswordFind.PasswordFind8`)}</button>
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
    );
}

export default PasswordFind;