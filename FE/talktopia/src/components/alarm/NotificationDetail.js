// NotificationDetail.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../utils";
import './NoficitaionDetail.css';
import AcceptButton from "./AcceptButton.js"; // "수락" 버튼 컴포넌트를 가져옵니다.
import DenyButton from "./DenyButton.js";
import CloseButton from "./CloseButton.js";
import { useTranslation } from "react-i18next";

function NotificationDetail({ rmNo, closeModal }) {
    const [notificationData, setNotificationData] = useState(null);
    const { t } = useTranslation();
    useEffect(() => {
        const fetchNotificationData = async () => {
            try {
                const userInfoString = localStorage.getItem("UserInfo");
                const userInfo = JSON.parse(userInfoString);
                
                const response = await axios.get(
                    `${BACKEND_URL}/api/v1/notice/${rmNo}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${userInfo.accessToken}`
                        }
                    }
                );
    
                setNotificationData(response.data);
            } catch (error) {
                console.error("Error fetching notification data:", error);
            }
        };
    
        fetchNotificationData();
    }, [rmNo]);
    

    if (!notificationData) {
        return <div>Loading...</div>;
    }

    // notificationData를 사용하여 컴포넌트 내용 구성
    return (
        <div className="NotificationDetailDiv">
            <div className="NotificationModalHeader">
                <div className="NotificationCloseButton" onClick={closeModal}>X</div>
            </div>
            <div className="NotificationBody">
            {notificationData.rmType === "Fail Request" ? (
                        <div className="NotificationDetailH1">{t(`NotificationDetail.NotificationDetail1`)}</div>
                    ) : notificationData.rmVrSession === "NONE" ? (
                        <div className="NotificationDetailH1">{t(`NotificationDetail.NotificationDetail2`)}</div>
                    ) : (
                        <div className="NotificationDetailH1">{t(`NotificationDetail.NotificationDetail3`)}</div>
                    )}
                <div className="NotificationDetailP">
                <div className="NotificationDetailLabel">{t(`NotificationDetail.NotificationDetail4`)}</div>
                    <div className="NotificationDetailLabelChildren"> {notificationData.rmContent}</div>
                </div>    
                <div className="NotificationDetailP">
                    <div className="NotificationDetailLabel">{t(`NotificationDetail.NotificationDetail5`)}</div>
                    <div className="NotificationDetailLabelChildren">{notificationData.rmType}</div>
                </div>
                <div className="NotificationDetailP">
                    <div className="NotificationDetailLabel">{t(`NotificationDetail.NotificationDetail6`)}</div>
                    <div className="NotificationDetailLabelChildren"> {notificationData.rmHost}</div>
                </div>
                <div className="NotificationDetailP">
                    {notificationData.rmVrSession !== "NONE" ? (
                        <>
                        <div className="NotificationDetailLabel">{t(`NotificationDetail.NotificationDetail7`)}</div>
                        <div className="NotificationDetailLabelChildren"> {notificationData.rmVrSession}</div>
                        </>
                    ) : null}
                </div>
                                {/* 여기에 나머지 데이터 표시 */}
            </div>
            <div className="buttonStatus">
            {notificationData.rmType === "Fail Request" ? (
                    // "Fail Request"인 경우에는 CloseButton을 렌더링
                    <CloseButton closeModal={closeModal} />
                ) : (
                    // 그 외의 경우에는 AcceptButton과 DenyButton을 렌더링
                    <>
                        <AcceptButton notification={notificationData} closeModal={closeModal} />
                        <DenyButton notification={notificationData} closeModal={closeModal} />
                    </>
                )}
            </div>
        </div>
    );
}

export default NotificationDetail;