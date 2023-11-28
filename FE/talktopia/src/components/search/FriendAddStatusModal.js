import React from 'react';
import './FriendAddStatusModal.module.css'; // 모달의 스타일을 정의한 CSS 파일

function FriendAddStatusModal({ isOpen, closeModal, children }) {
  if (!isOpen) return null;

  return (
    <div className="FriendAddStatusModal-overlay">
      <div className="FriendAddStatusModal-modal">
        <button className="FriendAddStatusModal-close-button" onClick={closeModal}>
          {/* 닫기er242 */}
        </button>
        {/* <div className="FriendAddStatusModal-content">{children}</div> */}
      </div>
    </div>
  );
}

export default FriendAddStatusModal;
