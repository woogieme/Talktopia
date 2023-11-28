import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VideoChatLogTable from './VideoChatLogTable';
import style from './AdminPage.module.css'

const VideoChatLogView = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // 백엔드에서 데이터 가져오기
        axios.get('https://talktopia.site:10001/api/v1/manage/logList').then(response => {
            setData(response.data);
        });
    }, []);

    return (
        <div className={style['manage-view-container']}>
            <VideoChatLogTable data={data} />
        </div>
    );
}

export default VideoChatLogView;
