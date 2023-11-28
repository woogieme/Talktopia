import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BACKEND_URL } from "../../utils";
import NotificationDetailModal from "../alarm/NotificationDetail"; // 새로운 모달 컴포넌트 추가
import { useTranslation } from "react-i18next";
// import addFriendIcon from "../../../public/img/dding/addFriendIcon.png"
// import inviteRoomIcon from "../../../public/img/dding/inviteRoomIcon.png"

import style from './Nav.module.css';

function Alram(){
    const { t } = useTranslation();
    const user = useSelector((state) => state.userInfo);
    const [notifications, setNotifications] = useState([]);
    const [ddingModalVisible, setDdingModalVisible] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);

    useEffect(() => {
        if (ddingModalVisible) {
            fetchNotifications();
        }
    }, [ddingModalVisible]);

    // 알림 데이터를 가져오는 함수
    const fetchNotifications = async () => {
        // console.log("fetchNotifications");
        try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/notice/list/${user.userId}`, {
            headers: {
                'Authorization': `Bearer ${user.accessToken}`
            }
        });
        setNotifications(response.data); // 데이터 배열에 직접 접근
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const refreshNotifications = () => {
        fetchNotifications();
      };

    // 유형에 따른 css class명 반환
    const getNotificationClass = (type) => {
        if (type === "Room Request") return style["notification-chat-invite"];
        if (type === "Friend Request") return style["notification-friend-request"];
        if (type === "Fail Request") return style["notification-fail-request"];
        return "";
    };
    const getNotificationIcon = (type) => {
        if (type === "Room Request") return "img/dding/inviteRoomIcon.png"
        if (type === "Friend Request") return "img/dding/addFriendIcon.png"
        if (type === "Fail Request") return "img/dding/failRequestIcon.png"
        if (type === "Done.") return "img/dding/doneRequestIcon.png"
        return null;
    };

    const handleDdingMouseOver = () => {
        setDdingModalVisible(true);
      };
    
      const handleDdingMouseOut = () => {
        setDdingModalVisible(false);
      };
        //모달창으로 가는 로직
      const handleNotificationClick = (notification,e) => {

        e.stopPropagation();
        setSelectedNotification(notification.rmNo);
        setDdingModalVisible(false);

    };
    return(
        <> 
        <div className={`${style["dding-space"]}`} onMouseOver={handleDdingMouseOver} onMouseOut={handleDdingMouseOut}>
            <img className={`${style.dding}`} src="/img/nav/dding.png" alt=""></img>
                {
                ddingModalVisible && (
                    <div className={style["ddingModal"]} onMouseOver={handleDdingMouseOver} onMouseOut={handleDdingMouseOut} >
                        <div className={style["refresh-button"]} onClick={refreshNotifications}>
                            <span className={style["refresh-icon"]}>⟳</span> {t(`Alram1.Alram11`)}
                        </div>

                        {notifications == [] ? (
                            <div className={style["notification-item"]}>
                                 <p>{t(`Alram1.Alram22`)}</p>
                            </div>
                        ) : (
                            <>
                                {notifications.map((notification, index) => (
                               <div
                                    key={index}
                                    onClick={(e) => handleNotificationClick(notification,e)} // 클릭 이벤트 핸들러 추가
                                    className={`${style["notification-item"]} ${getNotificationClass(notification.rmType)}`}
                                >
                                    <img src={getNotificationIcon(notification.rmType)} alt="notification icon" />
                                    {notification.rmContent}
                                </div>
                                ))}
                            </>
                        )}
                  </div>
                )}
        </div>
                      {selectedNotification && (
            <NotificationDetailModal rmNo={selectedNotification} closeModal={() => setSelectedNotification(null)} />
             )}  </>
    )
}

export default Alram;