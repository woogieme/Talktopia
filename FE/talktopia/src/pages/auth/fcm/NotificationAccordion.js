import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from "react-i18next";
function NotificationAccordion() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState('');  // JWT 토큰을 저장할 상태
  const { t } = useTranslation();
  
  // 알림 데이터를 가져오는 함수
  const fetchNotifications = async () => {
    console.log("fetchNotifications");
    try {
      const response = await axios.get('https://talktopia.site:10001/api/v1/notice/list/koreatest1', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      setNotifications(response.data); // 데이터 배열에 직접 접근
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
};

  useEffect(() => {
    // 예시로, 토큰을 가져오는 로직을 추가합니다. 실제로는 로그인 로직 등에서 토큰을 얻을 것입니다.
    const fetchToken = async () => {
      // 여기에 토큰을 가져오는 로직을 구현하세요.
      // 예를 들면:
      // const response = await axios.post('/api/login', {username, password});
        setToken("eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJrb3JlYXRlc3QxIiwiaWF0IjoxNjkxNjI3NTk4LCJleHAiOjE2OTE2NjM1OTh9.YnVZ03wiGl6pNAuC-HtqYcSgZDhnrgYgmcE3RqIaYDE");
    }
    fetchToken();

    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const refreshNotifications = () => {
    fetchNotifications();
  };

  return (
    <div className="notification-container">
      <button onClick={() => setIsOpen(!isOpen)}>{t(`NotificationAccordion.Notification1`)}</button>
      {isOpen && (
        <div>
          <div className="refresh-button" onClick={refreshNotifications}>
            <span className="refresh-icon">⟳</span> {t(`NotificationAccordion.Notification2`)}
          </div>
          <div className="accordion">
            {notifications.map((notification, index) => (
              <div key={index} className="notification-item">
                {notification.rmContent}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationAccordion;





