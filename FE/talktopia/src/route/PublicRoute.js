import{ useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import isLogin from "../utils/isLogin";

function PublicRoute({ element }) {
    const navigate = useNavigate();
  
    // 여기에서 로그인 상태를 확인하거나 다른 조건을 검사하여 접근을 허용하거나 막을 수 있습니다.
    const [isLoggedIn, setIsLoggedIn] = useState(true); // 예시 함수, 실제 구현 필요

    useEffect(() => {
        // 최초 렌더링 시에만 isLogin() 함수 호출
        const checkLogin = isLogin();
        setIsLoggedIn(checkLogin);
        
        if (checkLogin) {
            navigate('/home');
        }
    }, []);
    if (isLoggedIn) {
        return null;
    }
  
    return element; // 로그인 상태일 경우 컴포넌트를 렌더링
  }

export default PublicRoute;