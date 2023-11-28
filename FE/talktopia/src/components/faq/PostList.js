import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Link 컴포넌트 추가
import axios from 'axios';
import style from './PostList.module.css'; // 스타일 파일을 import
import { BACKEND_URL } from '../../utils';
import { useTranslation } from "react-i18next";
function PostList() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = useState([]);

  useEffect(() => {
    const userInfoString = localStorage.getItem("UserInfo");
    const userInfo = JSON.parse(userInfoString);

    const fetchData = async () => {
      try {
        await axios.get(`${BACKEND_URL}/api/v1/ask/enter?userId=${userInfo.userId}`,{
          headers : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userInfo.accessToken}`
          }
        })
        .then((response) => {
          console.log("성공");
          console.log(response);
          
          setData(response.data);
        })
        .catch((error) => {
          console.log("실패", error);
        })

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();


    // /////////////////////////////////////////////
    


  }, []);

  const [activeIndex, setActiveIndex] = useState(null);
  const handleItemClick = (index) => {
    if (index === activeIndex) {
      setActiveIndex(null); // 현재 열려있는 패널을 닫기 위해 클릭한 아이템의 인덱스를 초기화
    } else {
      setActiveIndex(index); // 클릭한 아이템의 인덱스로 패널을 열기
    }
  };


  return (
    // <div>
    //   {data.map((item, index) => (
    //     <div key={index} className="accordion-item">
    //       <button
    //         className={`accordion-title ${activeIndex === index ? 'active' : ''}`}
    //         onClick={() => handleItemClick(index)}
    //       >
    //         {item.postTitle}
    //       </button>
    //       {activeIndex === index && (
    //         <div className="accordion-content">
    //           {item.content}
    //         </div>
    //       )}
    //     </div>
    //   ))}
    // </div>


      <div>
        <ul className={`${style.ul}`}>
        <div className={`${style.li}`}> {t(`PostList.PostList1`)} &nbsp;&nbsp;&nbsp;&nbsp; {t(`PostList.PostList2`)} </div>
        </ul>
        <ul className={`${style.ul}`}>
          {data.map((item,i) => (
            <li className={`${style.li}`} key={item.postNo} onClick={()=>{navigate(`/post/${item.postNo}`)}}>
              <span>{i+1}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span>{item.postTitle}</span>
            </li>
          ))}
        </ul>
      </div>
  );
}

export default PostList;
