// UserTable.js
import React from 'react';
import '../../css/UserTable.css'
import { useTranslation } from "react-i18next";
function UserTable({ user }) {
    const { t } = useTranslation();
    return (
        <table className="user-table">
            <thead>
                <tr>
                    <th>{t(`UserTable.UserTable1`)}</th>
                    <th>{t(`UserTable.UserTable2`)}</th>
                    <th>{t(`UserTable.UserTable3`)}</th>
                    <th>{t(`UserTable.UserTable4`)}</th>
                    <th>{t(`UserTable.UserTable5`)}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{user.userId}</td>
                    <td>{user.userName}</td>
                    <td>{user.userEmail}</td>
                    <td>
                        <img src={user.userProfileImgUrl} alt="Profile" width="50" />
                    </td>
                    <td>{user.userLan}</td>
                </tr>
            </tbody>
        </table>
    );
}

export default User
