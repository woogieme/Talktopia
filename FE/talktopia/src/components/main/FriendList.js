import React, { useState } from 'react';
import style from './mainComponent.module.css';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BACKEND_URL, BACKEND_URL_CHAT } from '../../utils';
import { useSelector } from 'react-redux';
import { AiOutlineClose } from "react-icons/ai";
import { useTranslation } from "react-i18next";

import { useEffect } from 'react';
import friendListStyle from './FriendList.module.css';
import ChatWindow from '../../pages/friend/ChatWindow';
import SearchFind from '../../pages/search/SearchFind';

const FriendList = () => {
  const user = useSelector((state) => state.userInfo);
  const { t } = useTranslation();
  
  const [isUp, setIsUp] = useState(false);
  /* friend list용 state */
  const [friendList, setFriendList] = useState([]);
  const [isListVisible, setIsListVisible] = useState(false); // 친구창 모달
  const [selectedFriend, setSelectedFriend] = useState(null)
  const [showChat, setShowChat] = useState(false); // 채팅방 표시 여부
  const [enterSessionId, setEnterSessionId] = useState(""); // 채팅방 session
  const [chats, setChats] = useState([]) // 채팅 내용
  // 친구 검색
  const [searchVisible, setSearchVisible] = useState(false);

  /* friend list용 state 끝 */

  /* 함수 영역 시작 */
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.accessToken}`,
  };

  const crabClick = () => {
    fetchFriends();

    setIsUp(true);
    // if (isUp === true) {
      setTimeout(() => {
        setIsUp(false);
      }, 9000);
    // }
  };

  const fetchFriends = () =>{
    axios.get(`${BACKEND_URL}/api/v1/friend/list/${user.userId}`, { headers })
    .then((response) => {
      setFriendList(response.data);
      console.log("friends", response.data)
      setIsListVisible(true)
    })
    .catch((error) => {
      console.log(error);
    });

  }

    // enter chat
  const enterChat = (friend) => {
    const requestBody = {
      "userId" :user.userId,
      "friendId" : friend.userId
    }
    // console.log("enter request body: ", requestBody)
    axios.post(`${BACKEND_URL_CHAT}/api/v1/chat/enter`, JSON.stringify(requestBody)  ,{ headers })
      .then((response) => {
        // console.log("enter chat:", response.data);
      
        /* enter response */
        setEnterSessionId(response.data.sessionId)
        setChats(response.data.chatList) 
      
        /* chatWindow 모달용 */
        setSelectedFriend(friend);
        setShowChat(false)
        setShowChat(true);

        // 검색창 안나오게 함
        setSearchVisible(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handleShowChat = (message)=>{
    setShowChat(false);
  }
  const modalOpen = () => {
    setShowChat(false)
    setSearchVisible(!searchVisible);
  }
  const handleShowSearchFind = (msg) => {
    setSearchVisible(msg);
  }

  /* 함수 영역 끝 */



  // JSX ================================================================================================
  return (
    <div className={style.friendList}>
      <div className={`${style.crabContainer1}`}>
        <div onClick={crabClick} className={` ${isUp ? style.up : style.crab}`}></div>
      </div>

        { isListVisible &&
          <div className={`${friendListStyle["friend-list-modal-overlay"]}`}>
            <div className={`${friendListStyle["friend-list-modal"]}`}>
            <h2 className={`${friendListStyle["friend-list-h2"]}`}>{t(`FriendList1.ment1`)}</h2>
              {/* 돋보기 버튼 */}
              <img className={`${friendListStyle["modal-search-btn"]}`} src="/img/main/search.png" alt="" onClick={modalOpen}></img>
              {/* 닫기 버튼 */}
              <button onClick={() => {setIsListVisible(false); setShowChat(false); setSearchVisible(false) }} className={`${friendListStyle["modal-close-btn"]}`}><AiOutlineClose size='20'/></button>
              
              <div className={`${friendListStyle["friend-list"]}`}>
                { friendList && 
                  friendList.map((friend, i) => (
                    <div key={i} className={`${friendListStyle["friend-section"]}`}>

                      {/* 프사 영역 */}
                      {/* 접속한사람 */}
                      { friend.userStatus == "ONLINE" && (
                        <div className={`${friendListStyle["friend-section-profile"]} ${friendListStyle["friend-section-profile-online"]}`}>
                          <img src={friend.userImg}></img>
                        </div>)
                      }
                      {/* 다른용무중 */}
                      { friend.userStatus == "BUSY" && (
                        <div className={`${friendListStyle["friend-section-profile"]} ${friendListStyle["friend-section-profile-busy"]}`}>
                          <img src={friend.userImg}></img>
                        </div>)
                      }
                      {/* 미접속 */}
                      { (friend.userStatus == "OFFLINE"  || friend.userStatus == null) && (
                        <div className={`${friendListStyle["friend-section-profile"]} ${friendListStyle["friend-section-profile-offline"]}`}>
                          <img src={friend.userImg}></img>
                        </div>)
                      }
                      {/* 아예 상태 없음 */}
                      {/* { friend.userStatus == null && (
                        <div className={`${friendListStyle["friend-section-profile"]}`}>
                          <img src={friend.userImg}></img>
                        </div>)
                      } */}


                      {/* 유저 이름영역 */}
                      <div className={`${friendListStyle["friend-section-name"]}`}>
                        <div>
                          {friend.userId}
                        </div>
                        <div>{friend.userName}</div>
                      </div>
                      <button className={`${friendListStyle["enter-chat-btn"]}`} onClick={()=>{enterChat(friend)}}>
                        {/* <img src="http://www.w3.org/2000/svg"></img> */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-send" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
                      </button>
                    </div>
                  ))
                }
              </div>
            </div>

            { isListVisible &&
              showChat && selectedFriend
              &&(<ChatWindow
                friend = {selectedFriend}
                sessionId={enterSessionId}
                showChat={showChat ? 'show-chat' : 'hide-chat'}
                onShowChat={handleShowChat}
                chats={chats} />)
            }

          </div>
        }

      {searchVisible &&
      (<SearchFind searchVisible={searchVisible} onShowSearchFind={handleShowSearchFind}/>)
      }


    </div>
  )};

export default FriendList;
