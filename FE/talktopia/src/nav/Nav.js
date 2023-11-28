import { useEffect, useState } from 'react';
import style from './Nav.module.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Admin from '../components/nav/Admin';
import User from '../components/nav/User';
import Alram from '../components/nav/Alram';
import Earth from '../components/nav/Earth';
import Faq from '../components/nav/Faq';

function Nav(){
    const navigate = useNavigate();

    const user = useSelector((state) => state.userInfo);
    const [userName, setUserName] = useState("");
    const [userImg, setUserImg] = useState("");
    console.log(user.role, '유저권한')
    useEffect(() => {
      const userInfoString = localStorage.getItem("UserInfo");

      const userInfo = JSON.parse(userInfoString);
      setUserName(userInfo.userName);
      setUserImg(userInfo.profileUrl);
  }, []);

    return(
        <div>
            <span className={`${style.title}`} onClick={()=>{navigate('/home')}}>TalkTopia</span>
            {user.role === 'ADMIN' && <Admin />}
            <User/>
            <Alram/>
            <Earth/>
            <Faq/>
        </div>

        
    )
}

export default Nav;