import React, { useState } from 'react';
import UserView from './UserView';
import ReporterView from './ReporterView';
import VideoChatLogView from './VideoChatLogView';

import style from './AdminPage.module.css'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
const AdminPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [selectedPage, setSelectedPage] = useState('reporter'); // 초기 페이지를 'userView'로 설정

    return (
        <div className={style['background']}>
            <h1 className={style['admin-page-title']}>Admin Page</h1>
            <button onClick={()=>{navigate('/home')}} className={style['move-home']}>Home</button>
            
            <div className={style['manage-container']}>
                {/* <button className={style['manage-button']} onClick={() => setSelectedPage('userView')}>유저 보기</button> */}
                <button 
                    onClick={() => setSelectedPage('reporter')} 
                    className={`${style['manage-button']} ${selectedPage === 'reporter' ? style['selected-manage-button'] : ''}`}
                >
                    {t(`AdminPage.AdminPage2`)}
                </button>
                <button 
                    onClick={() => setSelectedPage('videoChatLog')} 
                    className={`${style['manage-button']} ${selectedPage === 'videoChatLog' ? style['selected-manage-button'] : ''}`}
                >
                    {t(`AdminPage.AdminPage3`)}
                </button>
            </div>

            {selectedPage === 'userView' && <UserView />}
            {selectedPage === 'reporter' && <ReporterView />}
            {selectedPage === 'videoChatLog' && <VideoChatLogView />}

            <img className={`${style.fish7}`} src="/img/fish/fish2.png" alt=""></img>
            <img className={`${style.fish2}`} src="/img/fish/friend11.png" alt=""></img>
            <img className={`${style.bubble1}`} src="/img/bubble/bubble1.png" alt=""></img>
            <img className={`${style.bubble2}`} src="/img/bubble/bubble2.png" alt=""></img>
            <img className={`${style.bubble3}`} src="/img/bubble/bubble3.png" alt=""></img>
        </div>
    );
}

export default AdminPage;
