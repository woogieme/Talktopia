import { useSelector } from "react-redux";
import axios from 'axios';

import OpenViduVideoComponent from './OvVideo';
import { FaUserPlus } from "react-icons/fa";
import { FaUserTimes } from "react-icons/fa";
import Swal from "sweetalert2";

import style from './UserVideoComponent.module.css'
import { BACKEND_URL } from '../../utils';
import { useTranslation } from "react-i18next";

const flag = {
    'ko-KR': 'https://talktopia.s3.ap-northeast-2.amazonaws.com/profile/%EC%BD%94%EB%A6%AC%EC%95%84.png',
    'en-US': 'https://talktopia.s3.ap-northeast-2.amazonaws.com/profile/%EB%AF%B8%EA%B5%AD.png',
    'de-DE': 'https://talktopia.s3.ap-northeast-2.amazonaws.com/profile/%EB%8F%85%EC%9D%BC.png',
    'ru-RU': 'https://talktopia.s3.ap-northeast-2.amazonaws.com/profile/%EB%9F%AC%EC%8B%9C%EC%95%84.png',
    'es-ES': 'https://talktopia.s3.ap-northeast-2.amazonaws.com/profile/%EC%8A%A4%ED%8E%98%EC%9D%B8.png',
    'it-IT': 'https://talktopia.s3.ap-northeast-2.amazonaws.com/profile/%EC%9D%B4%ED%83%88%EB%A6%AC%EC%95%84.png',
    'id-ID': 'https://talktopia.s3.ap-northeast-2.amazonaws.com/profile/%EC%9D%B8%EB%8F%84%EB%84%A4%EC%8B%9C%EC%95%84.png',
    'ja-JP': 'https://talktopia.s3.ap-northeast-2.amazonaws.com/profile/%EC%9E%AC%ED%8C%AC.png',
    'fr-FR': 'https://talktopia.s3.ap-northeast-2.amazonaws.com/profile/%ED%94%84%EB%9E%91%EC%8A%A4.png',
    'zh-CN': 'https://talktopia.s3.ap-northeast-2.amazonaws.com/profile/%EC%A4%91%EA%B5%AD.png',
    'zh-TW': 'https://talktopia.s3.ap-northeast-2.amazonaws.com/profile/%EC%A4%91%EA%B5%AD.png',
    'pt-PT': 'https://talktopia.s3.ap-northeast-2.amazonaws.com/profile/%ED%8F%AC%EB%A5%B4%ED%88%AC%EA%B0%88.png',
    'th-TH': 'https://talktopia.s3.ap-northeast-2.amazonaws.com/profile/%ED%83%9C%EA%B5%AD.png',
}


function UserVideoComponent (props) {
    const { t } = useTranslation();
    const user = useSelector((state) => state.userInfo);    // Redux 정보
    console.log(flag[props.nation])

    const friendAdd = async () => {

        const headers = {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${user.accessToken}`
        }

        const requestBody = {
            friendId: props.userId,     // 친구추가하려는 아이디
            userId: user.userId         // 본인 아이디
        };
        const requestBodyJSON = JSON.stringify(requestBody);

        await axios
        .post(`${BACKEND_URL}/api/v1/fcm/sendFriendMessage`, requestBodyJSON, {headers})
        .then((response) => {
            Swal.fire({
                icon: "success",
                // title: "만나서 반가워요!",
                text: response.data.message,
                confirmButtonText:  t(`UserVideoComponent.confirmButtonText1`),
                confirmButtonColor: '#90dbf4',
                timer: 1500,
                timerProgressBar: true,
              })


            console.log(response.data)
        })
        .catch((error) => {
            Swal.fire({
                icon: "error",
                // title: "만나서 반가워요!",
                text: error,
                confirmButtonText:t(`UserVideoComponent.confirmButtonText1`),
                confirmButtonColor: '#90dbf4',
                timer: 1500,
                timerProgressBar: true,
              })
            console.log("에러 발생", error);
        })
    }

    const reportUser = (e) => {
        e.preventDefault();
        props.openReportModal(props.userId);
    }

    return (
        <>
            <div className={style['user-info']}>

                <img src={flag[props.nation]} alt="" className={style['flag-img']} />
                <div className={style['name-tag']}>
                    <span>{`[${props.roomRole}] `}</span>
                    <br/>
                    <span>{props.userName}</span>
                </div>
            </div>
            
            {props.streamManager !== undefined ? (
                <div>                
                    <OpenViduVideoComponent 
                        streamManager={props.streamManager} 
                        participantCount={ props.participantCount } 
                    />
                </div>
            ) : null}

            {user.userId !== props.userId ? (
                <div className={style['participant-actions']}>
                    <button className={style['participant-actions-button']} onClick={ friendAdd }>
                        <FaUserPlus size="18"/>
                    </button>
                    <button className={style['participant-actions-button']} onClick={ reportUser }>
                        <FaUserTimes size="18"/>
                    </button>
                </div>
            ) : null}
        </>
    );
}

export default UserVideoComponent;