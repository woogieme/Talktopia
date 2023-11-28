import React from 'react';
// 필요한 모듈이나 API 요청 등은 여기에 추가하십시오.
import { useTranslation } from "react-i18next";
const UserView = () => {
    const { t } = useTranslation();
    return (
        <div>
            {t(`UserView.UserView1`)}
            {/* 유저 정보를 출력하거나, 유저 관련 기능을 여기에 구현하십시오. */}
        </div>
    );
}

export default UserView;
