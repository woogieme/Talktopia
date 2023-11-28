import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import style from "./IdFind.module.css";

function IdFindFail(props) {
  const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className={`${style.background}`}>
          <h2 className={`${style.logo}`}>TalkTopia</h2>
          <h2 className={`${style.title}`}>{t(`IdFindFail.JoinLogin1`)}</h2>
          <img className={`${style["fade-in-box"]}`} src="/img/find1.png" alt=""></img>
          <img className={`${style["fade-in-box-1"]}`} src="/img/penguin2.png" alt=""></img>
          <p className={`${style["p-1"]}`}>{t(`IdFindFail.IdFindFail2`)}</p>  
          <div className={`${style["button-together"]}`}>
            <button className={`${style["button-together-1"]}`} onClick={()=> navigate('/findId')}>{t(`IdFindFail.IdFindFail3`)}</button>
            <button className={`${style["button-together-1"]}`} onClick={() => navigate('/regist')}>{t(`IdFindFail.IdFindFail4`)}</button>
          </div>
          <img className={`${style.turtle}`} src="/img/fish/turtle.png" alt=""></img>
            <img className={`${style.grass2}`} src="/img/grass/grass2.png" alt=""></img>
            <img className={`${style.grass5}`} src="/img/grass/grass5.png" alt=""></img>
            <img className={`${style.fish4}`} src="/img/fish/fish4.png" alt=""></img>
            <img className={`${style.fish331}`} src="/img/fish/fish33.png" alt=""></img>
            <img className={`${style.fish34}`} src="/img/fish/fish34.png" alt=""></img>
            <img className={`${style.friend14}`} src="/img/fish/friend14.png" alt=""></img>
            <img className={`${style.bubble11}`} src="/img/bubble/bubble1.png" alt=""></img>
            <img className={`${style.bubble21}`} src="/img/bubble/bubble2.png" alt=""></img>
            <img className={`${style.bubble31}`} src="/img/bubble/bubble3.png" alt=""></img>
        </div>
    );
}

export default IdFindFail;