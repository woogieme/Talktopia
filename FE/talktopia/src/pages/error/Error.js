import style from './Error.module.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
function Error(){
    const navigate = useNavigate();
    const { t } = useTranslation();
    const goBack = () => {
      navigate(-1); // 이전 페이지로 이동
    };

    return(
        <div className={`${style.background}`}>
            <h2 className={`${style.h2}`}>{t(`Error.notFoundPage`)}</h2>
            <button className={`${style.button}`} onClick={goBack}>{t(`Error.backError`)}</button>
        </div>
    )
}

export default Error;