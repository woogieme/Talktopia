import {useDispatch, useSelector} from "react-redux";
import { BACKEND_URL } from "./env";
import { reduxUserInfo } from "../store";
import axios from "axios";
import { setCookie, getCookie } from "../cookie";

function NewToken(){
    const headers ={
        'Content-Type' : 'application/json'
    }

    const userInfoString = localStorage.getItem("UserInfo");
    const userInfo = JSON.parse(userInfoString);

    // const userId = useSelector((state) => state.userInfo.userId);
    // let dispatch = useDispatch();

    const refreshToken = getCookie('refreshToken');


    const requestBody = {
        userId: userInfo.userId,
        refreshToken: refreshToken
    };

    const requestBodyJSON = JSON.stringify(requestBody);

    // console.log(requestBodyJSON); //확인

    axios
        .post(`${BACKEND_URL}/api/v1/user/reqNewToken`, requestBodyJSON, {headers})
        .then((response)=>{
            console.log(response.data);
            // dispatch(reduxUserInfo({
            //     userId: response.data.userId,
            //     accessToken: response.data.accessToken,
            //     expiredDate: response.data.expiredDate
            // }));

            const userInfoString = localStorage.getItem("UserInfo");
            const userInfo = JSON.parse(userInfoString);

            userInfo.accessToken = response.data.accessToken;
            userInfo.expiredDate = response.data.expiredDate;

            //다시 localStorage에 저장
            localStorage.setItem("UserInfo", JSON.stringify(userInfo));

            setCookie('refreshToken', response.data.refreshToken, {
                path: '/',
                secure: true,
                // maxAge: 3000
            })
        })
        .catch((error)=>{
            console.log("에러",error);
        })
}

function getRefreshTokenFromCookie() {
    const cookies = document.cookie;
    const cookieArray = cookies.split("; ");
  
    // 쿠키에서 RefreshToken 값을 찾아서 반환
    for (const cookie of cookieArray) {
      const [key, value] = cookie.split("=");
      if (key === "refreshToken") {
        return value;
      }
    }
}

export default NewToken;