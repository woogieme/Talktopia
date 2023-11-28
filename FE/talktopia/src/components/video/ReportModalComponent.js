import { useCallback, useState } from 'react'
import { useSelector } from "react-redux";
import { BACKEND_URL } from '../../utils';
import axios from 'axios';
import { AiOutlineClose } from "react-icons/ai";
import Swal from "sweetalert2";

import style from './ReportModalComponent.module.css'


const checkBoxList = ['혐오발언', '성희롱', '인종차별', '기타']

function ReportModalComponent(props) {
    const user = useSelector((state) => state.userInfo);


    const [checkedList, setCheckedList] = useState([]);     // 신고 카테고리
    const [isChecked, setIsChecked] = useState(false);
    const [textValue, setTextValue] = useState('')          // 신고 상세 내용

    const checkedItemHandler = (value, isChecked) => {
        if (isChecked) {
            setCheckedList((prev) => [...prev, value]);
            return;
        }
    
        if (!isChecked && checkedList.includes(value)) {
            setCheckedList(checkedList.filter((item) => item !== value));
            return;
        }
        return;
    };

    const checkHandler = (e, value) => {
        setIsChecked(!isChecked);
        checkedItemHandler(value, e.target.checked);;
    };

    const handleTextChange = (e) => {
        setTextValue(e.target.value);
    };

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        console.log('checkdList: ', checkedList, !!checkedList.length)
        console.log('text: ', textValue, !!textValue)
        if (!checkedList.length || !textValue) {
            console.log('입력이 부족합니다.')
        } else {
            reportSubmit(checkedList, textValue);
        } 
    }, [checkedList, textValue]);

    const reportSubmit = async (category, reportText) => {
        const headers = {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${user.accessToken}`
        }
        
        const requestBody = {
            ruReporter: user.userId,
            ruBully: props.reportUserId,
            ruCategory: category,
            ruBody: reportText,
            vrSession: props.vrSession
        };

        const requestBodyJSON = JSON.stringify(requestBody);
        await axios
        .post(`${BACKEND_URL}/api/v1/manage/report`, requestBodyJSON, {headers})
        .then((response) => {
            Swal.fire({
                icon: "success",
                title: response.data.message,
                // text: response.data.message,
                confirmButtonText: "확인",
                confirmButtonColor: '#90dbf4',
                timer: 1500,
                timerProgressBar: true,
            })
            props.closeReportModal();
        })
        .catch((error) => {
            console.log("에러 발생", error);
            Swal.fire({
                icon: "error",
                title: error,
                // text: response.data.message,
                confirmButtonText: "확인",
                confirmButtonColor: '#90dbf4',
                timer: 1500,
                timerProgressBar: true,
            })
        })
    };

    const preventCloseTopicModal = (e) => {
        e.stopPropagation();
    }


    return (
        <>
            <div className={style['report-modal-content']} onClick={preventCloseTopicModal}>
                <div className={style['report-modal-titlebox']}>
                    <p className={style['report-modal-title']}>유저 신고</p>
                </div>

                <button className={style['report-modal-close']} onClick={props.closeReportModal}>
                    <AiOutlineClose size='20'/>
                </button>

                <form onSubmit={onSubmit}>
                    <div className={style['report-reason-container']} >
                        {checkBoxList.map((item, idx) => (
                            <div key={idx} className={style['report-reason-content']}>
                                <input className={style['checkbox']}
                                    type='checkbox' 
                                    id={item}
                                    checked={checkedList.includes(item)}
                                    onChange={(e) => checkHandler(e, item)}
                                />
                                <label htmlFor={item}>{item}</label>
                            </div>
                        ))}
                    </div>

                    <textarea className={style['textarea']}
                        value={textValue}
                        onChange={handleTextChange}
                        rows={4} // 원하는 줄 수로 설정
                        cols={30} // 원하는 열 수로 설정
                        placeholder='신고 상세 사유'
                    />

                    <button type='submit' className={style['report-button']}>신고하기</button>
                </form>
            </div>
        </>
    )
};

export default ReportModalComponent