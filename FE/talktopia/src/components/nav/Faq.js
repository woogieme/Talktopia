import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../utils";
import { useTranslation } from "react-i18next";
import style from './Nav.module.css';

function Faq(){
    const navigate = useNavigate();
    const { t } = useTranslation();
    const user = useSelector((state) => state.userInfo);
    const [userName, setUserName] = useState("");
    const [userImg, setUserImg] = useState("");

    const [faqModalVisible, setFaqMoalVisible] = useState(false);

    const handleFaqMouseOver = () => {
        setFaqMoalVisible(true);
    }
    
    const handleFaqMouseOut = () => {
        setFaqMoalVisible(false);
    }
      
    return(
        <div className={`${style["faq-space"]}`} onMouseOver={handleFaqMouseOver} onMouseOut={handleFaqMouseOut}>
            <img className={`${style.faq}`} src="/img/nav/faq3.png" alt="" onMouseOver={handleFaqMouseOver} onMouseOut={handleFaqMouseOut}></img>
            {
                faqModalVisible &&
                <div className={`${style.faqModal}`} onMouseOver={handleFaqMouseOver} onMouseOut={handleFaqMouseOut}>
                    <p className={`${style.faqtext}`} onClick={()=>{navigate('/faq')}}>FAQ</p>
                    <p className={`${style.faqtext}`} onClick={()=>{navigate('/counsel')}}>{t(`faqq.faqq1`)}</p>
                </div> 
            }
        </div>
    )
}

export default Faq;