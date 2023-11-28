import { useSelector } from "react-redux";
import NotificationDetailModal from '../alarm/NotificationDetail.js';
import React, { useState, useEffect } from 'react'; // useState를 임포트하세요.
import DenyListComponent from '../alarm/DenyListComponent.js';
function FCMModalComponent(props) {
    const user = useSelector((state) => state.userInfo);

    const [selectedNotification, setSelectedNotification] = useState(null);
    console.log("selectedNotification:", selectedNotification);

    useEffect(() => {
        // 알림을 받았을 때의 조건을 설정해야 합니다.
        // 예를 들어, props.modalData에 알림 데이터가 있는지 확인하거나, 특정 상태가 true인지 확인하는 등의 조건을 설정합니다.
        if (props.modalData) {
            setSelectedNotification(props.modalData);
            console.log(props.modalData.rmNo);
        } else {
            setSelectedNotification(null); // 알림이 없는 경우 상태를 null로 초기화
        }
    }, [props.modalData]);

  return (
    <>
        {props.showModal && selectedNotification && (
            <NotificationDetailModal rmNo={parseInt(props.modalData.rmNo)} closeModal={() => setSelectedNotification(null)} />
        )}

        {/* modalContent만 존재하는 경우에 DenyListComponent을 렌더링 */}
        {props.showModal && !props.modalData && props.modalContent && (
                <DenyListComponent content={props.modalContent} closeModal={props.closeModal}/>
        )}
    </>
  )
}

export default FCMModalComponent