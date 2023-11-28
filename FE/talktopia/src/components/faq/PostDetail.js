import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'; 
import style from './PostDetail.module.css'; 
import { BACKEND_URL } from '../../utils';
import Swal from 'sweetalert2';
import { reduxUserInfo } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import Nav from '../../nav/Nav';
import { useTranslation } from "react-i18next";

function PostDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  let dispatch = useDispatch();
  const user = useSelector((state) => state.userInfo);

  const [userId, setUserId] = useState("");
  const [userAccessToken, setUserAccessToken] = useState("");

  const { postNo } = useParams();

  const [detailedPost, setDetailedPost] = useState(null);
  const [newComment, setNewComment] = useState(""); // 새로운 댓글 입력 상태

  // const [userInfo, setUserInfo] = useState("");
  const [itsme, setItsme] = useState([]);

  const [isAdmin, setIsAdmin] = useState(false);

  const [postLength, setPostLength] = useState(0);
  const [createTime, setCreateTime] = useState("");
  const [formattedDateTime, setFormattedDateTime] = useState("");

  useEffect(() => {
    const userInfoString = localStorage.getItem("UserInfo");
    const userInfo = JSON.parse(userInfoString);
    setUserId(userInfo.userId);
    setUserAccessToken(userInfo.userAccessToken);
    setItsme(userInfo)

    if(userInfo.role === "ADMIN"){
      setIsAdmin(true);
    }
    dispatch(reduxUserInfo(userInfo));
}, []);

  // useEffect(()=>{

  // },[isAdmin])



  useEffect(() => {
    fetchData();
  }, [postNo]);

  
  const fetchData = async () => {
    const userInfoString = localStorage.getItem("UserInfo");
    const userInfo = JSON.parse(userInfoString);

    console.log(`${BACKEND_URL}/api/v1/ask/list/detail?userId=${userInfo.userId}&postNo=${postNo}`)
    try {
      await axios
      .get(`${BACKEND_URL}/api/v1/ask/list/detail?userId=${userInfo.userId}&postNo=${postNo}`,{
        headers : {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.accessToken}`
        }
      })
      .then((response) => {
        console.log(response);
        setDetailedPost(response.data);
        setPostLength(response.data.answerPosts.length);

        setCreateTime(response.data.postCreateTime);

        const dateTime = new Date(response.data.postCreateTime);

        const year = dateTime.getFullYear();
        const month = dateTime.getMonth() + 1;
        const day = dateTime.getDate();
        const hours = dateTime.getHours();
        const minutes = dateTime.getMinutes();
        const seconds = dateTime.getSeconds();

        setFormattedDateTime(`${t(`PostDetail.ment1`)} : ${year}${t(`PostDetail.ment2`)} ${month}${t(`PostDetail.ment3`)} ${day}${t(`PostDetail.ment4`)} ${hours}${t(`PostDetail.ment5`)} ${minutes}${t(`PostDetail.ment6`)} ${seconds}${t(`PostDetail.ment7`)}`);

      })
      .catch((error) => {
        console.log(error);
      })
    } catch (error) {
      console.error('에러', error);
    }
  };


  const handleCommentSubmit = async () => {
    const userInfoString = localStorage.getItem("UserInfo");
    const userInfo = JSON.parse(userInfoString);

    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/comment/answer`,
        {
          userId: userInfo.userId,
          postNo: postNo,
          contentContent: newComment
        },
        {
          headers : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userInfo.accessToken}`
          }
        }
      ).then((response) =>{
        setNewComment(""); // 새로운 댓글 입력 상태 초기화
        Swal.fire({
          icon: "success",
          title:  t(`PostDetail.ment8`),
          confirmButtonText: t(`PostDetail.ment9`),
          timer: 2000,
          timerProgressBar: true,
          confirmButtonColor: '#90dbf4',
        })
        fetchData(); // 새로운 댓글을 등록한 후에 데이터를 다시 가져옴

      }).catch((error) => {
        console.log(error.response.data.message);
        const message = error.response.data.message
        Swal.fire({
          icon: "error",
          title: message,
          confirmButtonText: t(`PostDetail.ment10`),
          confirmButtonColor: '#90dbf4',
        })
        console.log("댓글 등록 실패");
      })
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleDeleteButtonClick = () => {
    Swal.fire({
      icon: "warning",
      title: t(`PostDetail.ment11`),
      showCancelButton: true,
      confirmButtonText: t(`PostDetail.ment12`),
      cancelButtonText: t(`PostDetail.ment13`),
      timer: 2000,
      confirmButtonColor: '#90dbf4',
      cancelButtonColor: '#ec1c57',
    }).then((result) => {
      const userInfoString = localStorage.getItem("UserInfo");
      const userInfo = JSON.parse(userInfoString);

      if (result.isConfirmed) {
        const handleDeleteConfirm = async () => {
          try {
            await axios.get(
              `${BACKEND_URL}/api/v1/ask/list/delete?userId=${userInfo.userId}&postNo=${postNo}`,
              {
                headers : {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${userInfo.accessToken}`
                }
              }
            ).then((response) => {
              Swal.fire({
                icon: "success",
                title: t(`PostDetail.ment14`),
                confirmButtonText: t(`PostDetail.ment15`),
                timer: 2000,
                timerProgressBar: true,
                confirmButtonColor: '#90dbf4',
              }).then((result) =>{
                // if(result.isConfirmed){
                  navigate('/counsel');
                // }
              })

            }).catch((error) => {
              console.log("삭제 실패")
            })
          } catch (error) {
            console.error('Error deleting post:', error);
          }
        };
        handleDeleteConfirm();
      }
    })
  };



  if (!detailedPost) {
    return <p>Loading...</p>;
  }

  return (
    <div className={`${style.background1}`}>
      <Nav/>
        <div className={`${style.container1}`}>
          <h2 className={`${style.question}`}>{t(`PostDetail.ment16`)}</h2>
            <div className={`${style.box1}`}>
              <div className={`${style.header}`}>
                <h2 className={`${style.h2}`}>{t(`PostDetail.ment17`)} {detailedPost.postTitle}</h2>
                <p className={`${style.date}`}>{formattedDateTime}</p>
                <img className={`${style.line}`} src="/img/findMyInfo/find1.png" alt=""/>
                <p className={`${style["post-content"]}`}>{detailedPost.postContent}</p>
              </div>
            </div>
            <button className={`${style["delete-button"]}`} onClick={handleDeleteButtonClick}>{t(`PostDetail.ment18`)}</button>
        </div>

        <div className={`${style.container2}`}>
          <h2 className={`${style.question}`}>{t(`PostDetail.ment19`)}</h2>
          <div className={`${style.box2}`}>
            <div className={`${style["answer-posts"]}`}>
              {
                postLength !== 0 ? 
                <ul>
                  {detailedPost.answerPosts.map((answerPost, index) => (
                      <li className={`${style.li}`} key={index}>
                        <span className={`${style.answer1}`}>{t(`PostDetail.ment20`)} {index + 1}</span>
                        <p className={`${style.answer}`}>{answerPost.contentContent}</p>
                      </li>
                  ))}
                </ul>
                  : (
                    <ul>
                      <li className={`${style.li}`} >
                        <p className={`${style.answer2}`}>{t(`PostDetail.ment21`)}</p>
                        <p className={`${style.answer2}`}>{t(`PostDetail.ment22`)}</p>
                        <p className={`${style.answer2}`}>{t(`PostDetail.ment23`)}</p>
                      </li>
                    </ul>
                  )
              }
            </div>
          </div>

          {
            isAdmin ? 
            <div className={`${style["comment-section-container"]}`}>
                  <div className={`${style["comment-section"]}`}>
                    <input className={`${style["comment-input"]}`} type="text" placeholder={t(`PostDetail.ment24`)} value={newComment} onChange={(e) => setNewComment(e.target.value)}/>
                    <button className={`${style["comment-button"]}`} onClick={handleCommentSubmit}>{t(`PostDetail.ment25`)}</button>
                  </div>
              </div>
              :
              <div className={`${style["comment-section-container"]}`}>
                  <div className={`${style["comment-section"]}`}>
                    <div className={`${style["comment-input1"]}`}></div>
                    <div className={`${style["comment-button1"]}`}></div>
                  </div>
              </div>
          }
        </div>
        <img className={`${style.grass1}`} src="/img/grass/grass2.png" alt=""></img>
            <img className={`${style.grass5}`} src="/img/grass/grass5.png" alt=""></img>
            <img className={`${style.fish7}`} src="/img/fish/fish7.png" alt=""></img>
            <img className={`${style.fish6}`} src="/img/fish/fish6.png" alt=""></img>
            <img className={`${style.bubble1}`} src="/img/bubble/bubble1.png" alt=""></img>
            <img className={`${style.bubble2}`} src="/img/bubble/bubble2.png" alt=""></img>
            <img className={`${style.bubble3}`} src="/img/bubble/bubble3.png" alt=""></img>
    </div>
  );
}

export default PostDetail;
