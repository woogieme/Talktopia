import React from 'react';
import CloseButton from './CloseButton.js'; // CloseButton 컴포넌트를 가져옵니다.
import "./DenyListComponent.css";
import "./NoficitaionDetail.css";
import { useTranslation } from "react-i18next";
function DenyListComponent({ content,closeModal }) {
    const { t } = useTranslation();
    return (
        <div className="NotificationDetailDiv">
        <div className="NotificationModalHeader">
        </div>
        <div className="NotificationBody">
            <div className="NotificationDetailH1">
                <div className="NotificationDetailP">
                <div className="NotificationDetailLabelMain"> {t(`DenyList.DenyList1`)}</div>
                    <div className="NotificationDetailLabelChildrenMain">{content}</div>
                </div>
            </div>
        </div>
        <div>
        <CloseButton closeModal={closeModal} />
        </div>
        </div>
    );
}

export default DenyListComponent;