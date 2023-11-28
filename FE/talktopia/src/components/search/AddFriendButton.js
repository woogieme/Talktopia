import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FriendAddStatusModal from './FriendAddStatusModal';
import style from './FriendAddStatusModal.module.css';
import Swal from 'sweetalert2';
import { useTranslation } from "react-i18next";
function AddFriendButton({ userId, friendId }) {
  const { t } = useTranslation();
  const [isRequestSent, setIsRequestSent] = useState(false); // 친구 추가 요청 여부
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // 버튼 비활성화 여부
  const [message, setMessage] = useState(''); // 메시지 표시
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 창 열림 여부
  const closeModalAndRefresh = () => {
    setIsModalOpen(false);

  };
  const handleAddFriend = async () => {
    try {
      await axios.post(
        'https://talktopia.site:10001/api/v1/fcm/sendFriendMessage',
        {
          userId: userId,
          friendId: friendId
        }
      );

      Swal.fire({
        icon: "success",
        title:  t(`AddFriendButton.AddFriendButton1`),
        confirmButtonText:  t(`AddFriendButton.AddFriendButton2`),
        confirmButtonColor: '#90dbf4',
        timer: 2000,
        timerProgressBar: true,
    })

      setIsRequestSent(true);
      // setMessage('친구 추가를 요청하셨습니다 !');
      setIsButtonDisabled(true);
      setIsModalOpen(true);

      setTimeout(() => {
        setIsRequestSent(false);
        setMessage( t(`AddFriendButton.AddFriendButton3`));
        setIsModalOpen(false); // 모달창을 닫아줍니다.
        setTimeout(() => {
          setMessage('');
          setIsButtonDisabled(false);
        }, 4000); // 4초 후에 버튼 활성화 및 메시지 초기화
      }, 500); // 1초 후에 메시지 변경

    } catch (error) {
      if (error.response && error.response.data) {
        console.log("제발",error.response.data);
        const errorMessage = error.response.data;
        if (error.response && error.response.data && error.response.data.message === '이미 친구입니다.') {
          Swal.fire({
            icon: "warning",
            title: t(`AddFriendButton.AddFriendButton4`),
            confirmButtonText: t(`AddFriendButton.AddFriendButton2`),
            confirmButtonColor: '#90dbf4',
            timer: 2000,
            timerProgressBar: true,
        })
    
          setMessage(t(`AddFriendButton.AddFriendButton5`));
          setIsModalOpen(true);
          setTimeout(() => {
            closeModalAndRefresh(); // 일정 시간 후에 모달을 닫고 초기화
          }, 3000); // 3초 후에 모달을 닫기
  
        } else {
          console.error('Error sending friend message:', error);
        }
      } else {
        console.log("이건아니길",error.response.data);
        console.error('Error sendingaaa friend message:', error);
      }
    }
  };

  return (
    <>
      <button
        className={`${style.myfriendAdd} ${isButtonDisabled ? 'disabled' : ''}`}
        onClick={isButtonDisabled ? null : handleAddFriend}
      >
        {message ||  t(`AddFriendButton.AddFriendButton6`)}
      </button>
      <FriendAddStatusModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)}>
        
        {/* {message} */}
      </FriendAddStatusModal>
    </>
  );
}

export default AddFriendButton;
