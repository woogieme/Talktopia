import './App.css';
import { Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';


// Router
//start
import Start from './pages/start/Start.js';
//auth
import Regist from './pages/auth/MyInfo/JoinLogin.js';
import SocialLogin from './pages/auth/MyInfo/SocialLogin.js';
import IdFind from './pages/auth/FindMyInfo/IdFind.js';
import IdFindSuccess from './pages/auth/FindMyInfo/IdFindSuccess.js';
import IdFindFail from './pages/auth/FindMyInfo/IdFindFail.js';
import PasswordFind from './pages/auth/FindMyInfo/PasswordFind.js';
import PasswordFindSuccess from './pages/auth/FindMyInfo/PasswordFindSuccess.js';
import PasswordFindFail from './pages/auth/FindMyInfo/PasswordFindFail.js';

//home
import Home from './pages/home/Home.js';

//mypage
import MyInfo from './pages/mypage/MyInfo.js';
import MyInfoPw from './pages/mypage/MyInfoPw.js';
import Leave from './pages/mypage/Leave.js';

// faq
import Faq from './pages/faq/Faq.tsx';
import Counsel from './pages/faq/Counsel.js';
import PostForm from './components/faq/PostForm.js';
import PostDetail from './components/faq/PostDetail.js';

import Translation from './apis/translation/GoogleTranslator.js';
import WebSpeechApi from './apis/stt/WebSpeechApi.js';
import Sample from './apis/stt/Sample.js';
import JoinRoom from './pages/video/JoinRoom.js';

import GoogleLoginButton from './pages/auth/MyInfo/GoogleLoginButton';
import { AnimatePresence } from "framer-motion";

// FCM
import ServiceWorkerListener from './pages/auth/fcm/ServiceWorkerListener';
import FCMModalComponent from './components/fcm/FCMModalComponent';

import Error from './pages/error/Error.js';
import PrivateRoute from './route/PrivateRoute';
import PublicRoute from './route/PublicRoute';
import Logout from './pages/auth/MyInfo/Logout'

// Admin
import AdminPage from './pages/admin/AdminPage';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalData, setModalData] = useState(undefined);

  const handleMessage = (payload) => {
    setModalContent(payload.notification.body); // 받는 내용
    setModalData(payload.data);                 // 받는 데이터
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <div className="App">
      <AnimatePresence>
      {/* router */}
      <Routes>
        {/* start */}
        <Route path="/" element={<Start/>}/>
        {/* auth */}
        {/* <Route path="/regist" element={<Regist/>}/>
        <Route path="/snsRegist" element={<SocialLogin/>}/>
        <Route path="/findId" element={<IdFind/>}/>
        <Route path="/findId/success" element={<IdFindSuccess/>}/>
        <Route path="/findId/fail" element={<IdFindFail/>}/>
        <Route path="/findPassword" element={<PasswordFind/>}/>
        <Route path="/findPassword/success" element={<PasswordFindSuccess/>}/>
        <Route path="/findPassword/fail" element={<PasswordFindFail/>}/> */}

        <Route path="/regist" element={<PublicRoute element={<Regist/>}/>}/>
        <Route path="/snsRegist" element={<PublicRoute element={<SocialLogin/>}/>}/>
        <Route path="/findId" element={<PublicRoute element={<IdFind/>}/>}/>
        <Route path="/findId/success" element={<PublicRoute element={<IdFindSuccess/>}/>}/>
        <Route path="/findId/fail" element={<PublicRoute element={<IdFindFail/>}/>}/>
        <Route path="/findPassword" element={<PublicRoute element={<PasswordFind/>}/>}/>
        <Route path="/findPassword/success" element={<PublicRoute element={<PasswordFindSuccess/>}/>}/>
        <Route path="/findPassword/fail" element={<PublicRoute element={<PasswordFindFail/>}/>}/>

        {/* home */}
        <Route path="/home" element={<PrivateRoute element={<Home/>}/>}/>
        {/* myInfo */}
        <Route path="/myinfo" element={<PrivateRoute element={<MyInfo/>}/>}/>
        <Route path="/myinfo/passwordConfirm" element={<PrivateRoute element={<MyInfoPw/>}/>}/>
        {/* <Route path="/myinfo" element={<MyInfo/>}/> */}
        {/* <Route path="/myinfo/passwordConfirm" element={<MyInfoPw/>}/> */}

        {/* faq */}
        <Route path="/faq" element={<PrivateRoute element={<Faq/>}/>}/>
        <Route path="/counsel" element={<PrivateRoute element={<Counsel/>}/>}/>
        <Route path="/inquiry" element={<PrivateRoute element={<PostForm/>}/>}/>
        {/* <Route path="/post/:postNo" element={<PostDetail />} /> */}
        <Route path="/post/:postNo" element={<PrivateRoute element={<PostDetail/>}/>}/>
        
        {/* <Route path="/faq" element={<Faq/>}></Route>
        <Route path="/counsel" element={<Counsel/>}></Route> */}

        <Route path="/translation" element={<Translation/>}/>
        <Route path="/stt" element={<WebSpeechApi/>}/>
        <Route path="/sample" element={<Sample/>}/>
        <Route path="/joinroom" element={<JoinRoom/>}/>
        <Route path="/bye" element={<Leave/>}/>

        {/* 로그아웃 */}
        <Route path="/logout" element={<Logout/>}/>
        {/* 없는 페이지 */}
        <Route path="/*" element={<Error/>}/>
        {/* 삭제할거 */}
        <Route path="/google" element={<GoogleLoginButton/>}/>

        {/* 관리자페이지 */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      </AnimatePresence>

      <ServiceWorkerListener onMessage={handleMessage} />
      <FCMModalComponent 
        showModal={ showModal }
        modalContent={ modalContent }
        modalData = { modalData }
        closeModal={ closeModal }     
      />
    </div>
  );
}

export default App;