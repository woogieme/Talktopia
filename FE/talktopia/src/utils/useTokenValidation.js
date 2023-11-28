import { useEffect } from "react";
import IsTokenValid from "./tokenUtils";
import axios from "axios";
import { BACKEND_URL } from "./env";
import { removeCookie } from "../cookie";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import newToken from "./newToken";
import { useTranslation } from "react-i18next";

function useTokenValidation(userInfo){
  const navigate = useNavigate();
  const { t } = useTranslation();
    useEffect(() => {
      const userInfoString = localStorage.getItem("UserInfo");
      const userInfo = JSON.parse(userInfoString);


        const isTokenValid = IsTokenValid(userInfo);
        console.log("숫자" , isTokenValid);

        if (isTokenValid === 0) {
          //토큰 재요청
          newToken();
          console.log("토큰 재요청할게요.")
        }else if(isTokenValid === -1){
            axios.get(`${BACKEND_URL}/api/v1/user/logout/${userInfo.userId}`, {
                params: {
                    name: userInfo.userId 
                },
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${userInfo.accessToken}`
                }
              }).then((response)=>{
                removeCookie('refreshToken');
                localStorage.removeItem("UserInfo");
                Swal.fire({
                    icon: "error",
                    title:  t(`useTokenValidation.useTokenValidation1`)+ <br/> + t(`useTokenValidation.useTokenValidation2`),
                    text:  t(`useTokenValidation.useTokenValidation3`),
                    confirmButtonText:  t(`useTokenValidation.useTokenValidation4`),
                    confirmButtonColor: '#90dbf4',
                  }).then(() => {
                    navigate('/logout')
                  }
                  );
             })
             .catch((error)=>{
                 console.log("로그아웃 실패", error);
             })
             console.log("로그아웃합니다.");
        }

        console.log("그냥 실행~")
      }, [userInfo]);
}

export default useTokenValidation;