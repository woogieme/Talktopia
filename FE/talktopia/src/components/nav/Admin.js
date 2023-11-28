import { useNavigate } from 'react-router-dom';
import style from './Nav.module.css';
import { useState } from 'react';
import { useTranslation } from "react-i18next";
function Admin() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [adminModalVisible, setAdminMoalVisible] = useState(false);

    const handleAdminMouseOver = () => {
        setAdminMoalVisible(true);
      }
    
      const handleAdminMouseOut = () => {
        setAdminMoalVisible(false);
      }

    return (
        <div className={`${style["admin-space"]}`} onClick={()=>{navigate('/Admin')}} onMouseOver={handleAdminMouseOver} onMouseOut={handleAdminMouseOut}>
            {/* <button className={`${style["admin"]}`} onClick={()=>{navigate('/Admin')}}> */}
            <img className={`${style.admin}`} src="/img/nav/admin.png" alt="" onMouseOver={handleAdminMouseOver} onMouseOut={handleAdminMouseOut}></img>
            {
            adminModalVisible &&
                <div onClick={()=>{navigate('/Admin')}} onMouseOver={handleAdminMouseOver} onMouseOut={handleAdminMouseOut}>
                    <div className={`${style.adminModal}`}>
                        <p className={`${style.countrytext}`}>{t(`Admin1.Admin11`)}</p>
                    </div>
                </div>
            }
            {/* </button> */}
        </div>
    ) 
};

export default Admin;