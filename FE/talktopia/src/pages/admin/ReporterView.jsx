import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReporterTable from './ReporterTable';  // 해당 경로로 수정 필요
import style from './AdminPage.module.css'

const ReporterView = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // 백엔드에서 신고자 정보 가져오기
        axios.get('https://talktopia.site:10001/api/v1/report/list')  // 실제 API endpoint로 수정 필요
        .then(response => {
            setData(response.data);
        })
        .catch(error => {
            console.error("Error fetching reported users:", error);
        });
    }, []);

    return (
        <div className={style['manage-view-container']}>
            {/* <h2>신고자 정보</h2> */}
            <ReporterTable data={data} />
        </div>
    );
}

export default ReporterView;
