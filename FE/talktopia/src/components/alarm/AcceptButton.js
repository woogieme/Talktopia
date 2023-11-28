import React from "react";
import axios from "axios";
import { BACKEND_URL } from "../../utils";
import "./AcceptButton.css"
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

function AcceptButton({ notification, closeModal }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const handleAccept = async () => {
        try {
            const userInfoString = localStorage.getItem("UserInfo");
            const userInfo = JSON.parse(userInfoString);

            // Mark the notification as read
            const readAccessData = {
                rmType: notification.rmType,
                rmVrSession: notification.rmVrSession,
                rmHost: notification.rmHost,
                rmGuest: notification.rmGuest,
                receiverNo: notification.receiverNo,
            };
            await axios.post(`${BACKEND_URL}/api/v1/notice/read/access`, readAccessData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.accessToken}`
                }
            });

            // Perform the appropriate action based on rmType
            if (notification.rmType === "Room Request") {
                const joinFriendData = {
                    vrSession: notification.rmVrSession,
                    userId: notification.rmGuest,
                };
                console.log("이거들어가냐?");
                console.log(notification.rmVrSession);
                console.log(notification.rmGuest);
                await axios.post(`${BACKEND_URL}/api/v1/room/joinFriend`, joinFriendData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userInfo.accessToken}`
                    }
                }).then((response) => {
                    console.log(response.data.token)
                    navigate('/joinroom', {
                        state: {
                            // myUserName: user.userId,
                            mySessionId: response.data.vrSession,
                            token: response.data.token,
                            roomRole: response.data.roomRole,
                            allRoomRoles: response.data.showAllVRoomRes,
                            roomType: 'friend'
                        }
                    });
                }).catch((error)=> {

                    console.log("에러:", error);
                    if (error.response  && error.response.data.message === "방이 꽉찼어요") {
                        // "방이 꽉찼어요" 에러 처리
                        Swal.fire({
                            icon: "error",
                            title: t(`Accept.Accept1`),
                            text: t(`Accept.Accept2`),
                            confirmButtonText: t(`Accept.Accept3`),
                            confirmButtonColor: '#f47b7b',
                            timer: 2000,
                        timerProgressBar: true,
                        });
                    } else {
                        // 다른 에러 처리
                        Swal.fire({
                            icon: "error",
                            title: t(`Accept.Accept4`),
                            text: t(`Accept.Accept5`),
                            confirmButtonText: t(`Accept.Accept6`),
                            confirmButtonColor: '#f47b7b',
                            timer: 2000,
                        timerProgressBar: true,
                        });
                    }
                })
            } else if (notification.rmType === "Friend Request") {
                const addFriendData = {
                    userId: notification.rmHost,
                    partId: notification.rmGuest,
                };
                await axios.post(`${BACKEND_URL}/api/v1/friend/add`, addFriendData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userInfo.accessToken}`
                    }
                }).then((response) => {

                    Swal.fire({
                        icon: "success",
                        title: t(`Accept.Accept7`),
                        text: t(`Accept.Accept8`),
                        confirmButtonText: t(`Accept.Accept9`),
                        confirmButtonColor: '#90dbf4',
                        timer: 2000,
                        timerProgressBar: true,
                      })
                }).catch((error) => {
                    if (error.response && error.response.status === 500 && error.response.data.message === "중복된 친구입니다.") {
                        // 서버에서 RunTimeException을 던진 경우 처리
                        Swal.fire({
                            icon: "error",
                            title:t(`Accept.Accept10`),
                            text: t(`Accept.Accept11`),
                            confirmButtonText: t(`Accept.Accept12`),
                            confirmButtonColor: '#f47b7b',
                            timer: 3000,
                            timerProgressBar: true,
                        });
                    } else {
                        console.log("에러", error);
                        Swal.fire({
                            icon: "error",
                            title: t(`Accept.Accept13`),
                            text: t(`Accept.Accept14`),
                            confirmButtonText: t(`Accept.Accept15`),
                            confirmButtonColor: '#f47b7b',
                            timer: 3000,
                            timerProgressBar: true,
                        });
                    }
                })
            }

            closeModal(); // Close the modal
        } catch (error) {
            console.error("Error accepting request:", error);
        }
    };

    if (notification.rmType === "Done.") {
        return null;
    }

    return (
        <button className="AcceptButton" onClick={handleAccept}>
            <img className ="NotificationImg" src="img/dding/doneRequestIcon.png" alt="Accept Icon" />
            {t(`Accept.Accept16`)}
        </button>
    );
}

export default AcceptButton;
