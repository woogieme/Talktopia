import { useNavigate } from "react-router-dom";
import style from "./Leave.module.css";
import { useTranslation } from "react-i18next";

function Leave(){
    const { t } = useTranslation();
    let navigate = useNavigate();

    const confirm = ()=>{
        navigate('/');
    }

    return(
        <div className={`${style.background}`}>
            <h2 className={`${style.logo}`}>TalkTopia</h2>
            <h2 className={`${style.title}`}> {t(`Leave.msg1`)}</h2>
            <p className={`${style.p}`}>{t(`Leave.msg2`)}</p>
            <p className={`${style.p}`}>{t(`Leave.msg3`)}</p>
            <button className={`${style.button}`} onClick={confirm}>{t(`Leave.accept`)}</button>
        </div>
    )
}

export default Leave;