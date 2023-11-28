import React from 'react';
import './ChatTable.css';
// import logIcon from "../../../public/img/admin/logImage.png"
import style from './VideoChatLogTable.module.css'
import { useTranslation } from "react-i18next";
const VideoChatLogTable = ({ data }) => {
    return (
        <table className={style["chat-table"]}>
            <thead>
                <tr>
                    <th>DB No</th>
                    <th>방 ID</th>
                    <th>생성 시간</th>
                    <th>종료 시간</th>
                    <th>LogFile</th>
                </tr>
            </thead>
            <tbody>
                {data.map((entry, index) => (
                    <tr key={entry.svrNo}>
                        <td>{entry.svrNo}</td>
                        <td>{entry.svrSession}</td>
                        <td>{entry.svrCreateTime}</td>
                        <td>{entry.svrCloseTime}</td>
                        <td><a href={entry.logFileUrl} target="_blank" rel="noopener noreferrer">
                            <img src="img/admin/logImage.png" alt="Download Log" width="30" />
                            </a>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default VideoChatLogTable;
