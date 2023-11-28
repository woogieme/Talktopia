import { useNavigate } from "react-router-dom";

import style from "./IdFind.module.css";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
function IdFindSuccess() {
  const { t } = useTranslation();
    const user = useSelector((state) => state.findMyInfo);
    // const [userName,setUserName] = user.userName;
    // const [userEmail,setUserEmail] = user.userEmail;

    // useEffect(() => {
    //     setUserName(user.userName);
    //     setUserEmail(user.userEmail);
    // })

    const navigate = useNavigate();


    return (
      <div className={`${style.background}`}>
        <h2 className={`${style.logo}`}>TalkTopia</h2>
        <h2 className={`${style.title}`}>{t(`IdFindSuccess.IdFindSuccess1`)}</h2>
        <div className={`${style["img-container"]}`}>
          <img className={`${style["fade-in-box"]}`} src="/img/find1.png" alt=""></img>
          <img className={`${style["fade-in-box-1"]}`} src="/img/penguin1.png" alt=""></img>
        </div>
        <p className={`${style.p1}`}>{t(`IdFindSuccess.IdFindSuccess2`)}</p>
        <p className={`${style.p}`}><span className={`${style.span1}`}>{user.userName}</span>{t(`IdFindSuccess.IdFindSuccess3`)} <span className={`${style.span1}`}>{user.userEmail}</span>{t(`IdFindSuccess.IdFindSuccess4`)}</p>
        <div className={`${style["button-together"]}`}>
            <button className={`${style["button-together-1"]}`}  onClick={() => navigate('/regist')}>{t(`IdFindSuccess.IdFindSuccess5`)}</button>
            <button className={`${style["button-together-1"]}`} onClick={()=> navigate('/findPassword')}>{t(`IdFindSuccess.IdFindSuccess6`)}</button>
        </div>
        <img className={`${style.turtle}`} src="/img/fish/turtle.png" alt=""></img>
            <img className={`${style.grass2}`} src="/img/grass/grass2.png" alt=""></img>
            <img className={`${style.grass5}`} src="/img/grass/grass5.png" alt=""></img>
            <img className={`${style.fish4}`} src="/img/fish/fish4.png" alt=""></img>
            <img className={`${style.fish332}`} src="/img/fish/fish33.png" alt=""></img>
            <img className={`${style.fish34}`} src="/img/fish/fish34.png" alt=""></img>
            <img className={`${style.friend14}`} src="/img/fish/friend14.png" alt=""></img>
            <img className={`${style.bubble1}`} src="/img/bubble/bubble1.png" alt=""></img>
            <img className={`${style.bubble22}`} src="/img/bubble/bubble2.png" alt=""></img>
            <img className={`${style.bubble3}`} src="/img/bubble/bubble3.png" alt=""></img>
  </div>
);
}

export default IdFindSuccess;