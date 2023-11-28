// DenyButton.js
import React from "react";
import axios from "axios";
import { BACKEND_URL } from "../../utils";
import "./DenyButton.css"
import e from "cors";
import { useTranslation } from "react-i18next";
function DenyButton({ notification, closeModal }) {
    const { t } = useTranslation();
    const handleDenyClick = async () => {
        const requestData = {
            rmType: notification.rmType,
            rmVrSession: notification.rmVrSession,
            rmHost: notification.rmHost,
            receiverNo: notification.receiverNo,
        };

        try {
            console.log(requestData.receiverNo,requestData.rmHost,requestData.rmVrSession,requestData.rmType)
            const userInfoString = localStorage.getItem("UserInfo");
            const userInfo = JSON.parse(userInfoString);
            await axios.post(`${BACKEND_URL}/api/v1/notice/read/deny`, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.accessToken}`
                }
            }).catch((error)=> {
                console.log(error);
            })
            closeModal(); // Close the modal after denying
        } catch (error) {
            console.error("Error denying notification:", error);
            // Handle error here
        }
    };
    if (notification.rmType === "Done.") {
        return null;
    }

    return (
        <button className="DenyButton" onClick={handleDenyClick}>
            <img className ="NotificationImg" src="img/dding/failRequestIcon.png" alt="Fail Icon" />
            {t(`Deny.Deny1`)}
        </button>
    );
}

export default DenyButton;
