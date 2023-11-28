import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import style from './SearchFind.module.css'
import AddFriendButton from '../../components/search/AddFriendButton' // 추가된 부분
import useTokenValidation from '../../utils/useTokenValidation';
import { AiOutlineClose } from "react-icons/ai";
import { useTranslation } from "react-i18next";

function FriendSearch({searchVisible, onShowSearchFind}) {
  useTokenValidation();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchNickname, setSearchNickname] = useState('');
  const [searchType, setSearchType] = useState('ID'); // 초기값으로 'ID' 설정
  const [searchResults, setSearchResults] = useState([]);

  const [selectedLanguage, setSelectedLanguage] = useState(''); // 선택된 언어
  const languageOptions = [ // 언어 옵션들을 배열로 정의
  '한국어', '독일어', '러시아어', '스페인어', '영어',
  '이탈리아어', '인도네시아어', '일본어', '중국어_간체',
   '중국어_번체', '힌디어', '포르투갈어', '프랑스어'
];

  const userInfoString = localStorage.getItem("UserInfo");
  const userInfo = JSON.parse(userInfoString);


const [modal, setModal] = useState(searchVisible);

// setModal(searchVisible);
  const fetchUserResults = async () => {
    if (searchNickname.trim() === '' && searchType!=='LANG') {
      // 입력값이 비어있다면 요청하지 않음
      setSearchResults([]);
      return;
    }

    const userInfoString = localStorage.getItem("UserInfo");
    const userInfo = JSON.parse(userInfoString);
  
    try {
      const response = await axios.post(
        'https://talktopia.site:10001/api/v1/friend/findUserId',
        {
          search: searchNickname,
          findType: searchType,
          userId: userInfo.userId,
          language: selectedLanguage
        }
      );
      console.log(searchNickname);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // 검색어 또는 검색 타입 변경 시에 fetchUserResults 함수 호출
  useEffect(() => {
    fetchUserResults();
  }, [searchNickname, searchType,selectedLanguage]);

  const handleInputChange = (e) => {
    setSearchNickname(e.target.value);
    // 백스페이스를 눌렀을 때 요청하지 않음
    if (e.target.value === '') {
      setSearchResults([]);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSearchNickname('');
    setSearchResults([]);
  };
  const addFriend = (userId) => {
    // 친구 추가 로직을 구현해야 함
    console.log(`친구 추가 버튼 클릭: userId=${userId}`);
  };
  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value); // 선택된 언어 업데이트
  };
  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return <p>{t(`searchFind.searchFind1`)}</p>;
    }
};

useEffect(()=>{
  setModal(searchVisible);
},[])

const modalChange = () => {
  setModal(!modal);
  onShowSearchFind(false);
}

  return (
    <>

    {modal &&
    <div className={`${style.janjan}`}>
        <div>
        <h2 className={`${style.modaltitle}`}>{t(`searchFind.searchFind2`)}</h2>
          <button onClick={modalChange}  className={`${style.out}`}><AiOutlineClose size='20'/></button>

        </div>
        <div className={`${style.button1}`}>
          <button className={`${style["button-change"]}`} onClick={() => setSearchType('ID')}>{t(`searchFind.searchFind3`)}</button>
          <button className={`${style["button-change"]}`} onClick={() => setSearchType('EMAIL')}>{t(`searchFind.searchFind4`)}</button>
          <button className={`${style["button-change"]}`} onClick={() => setSearchType('LANG')}>{t(`searchFind.searchFind5`)}</button>
        </div>
        <div className={`${style["button-input"]}`}>
            {
              searchType === 'LANG' && ( // 언어 검색일 때만 드롭다운 메뉴 표시
              <select className={`${style.iSelect}`} value={selectedLanguage} onChange={handleLanguageChange}>
                <option value=''>{t(`searchFind.searchFind6`)}</option>
                {languageOptions.map((language, index) => (
                  <option key={index} value={language}>{language}</option>
                ))}
              </select>
            )}
            {
            searchType !== 'LANG' && ( // 언어 검색이 아닐 때는 입력 창 표시
              <input
                type="text"
                value={searchNickname}
                onChange={handleInputChange}
                placeholder={searchType === 'ID' ? t(`searchFind.searchFind7`) : t(`searchFind.searchFind8`)}
                className={`${style.iInput}`}
              />
            )}
        </div>
        <hr className={`${style["search-find-hr"]}`}></hr>
        <h2 className={`${style.modaltitle1}`}>{t(`searchFind.searchFind9`)}</h2>
        <div className={`${style["search-results"]}`}>
          <div className={`${style.container}`}>
            {
              searchResults.length > 0 ? (
                <div className={`${style["table-container"]}`}>
                  {searchResults.map((user, index) => (
                    <div className={`${style.row}`} key={index}>                        {/* <div className={`${style.image1}`}>
                        <img src={user.userImg} alt={`프로필 이미지 ${user.userImg}`} className={`${style["img-small"]}`}/>
                      </div> */}
                      
                      {/* 프사 영역 */}
                      {/* 접속한사람 */}
                      { user.userStatus == "ONLINE" && (
                        <div className={`${style["friend-section-profile"]} ${style["friend-section-profile-online"]}`}>
                          <img src={user.userImg}></img>
                        </div>)
                      }
                      {/* 다른용무중 */}
                      { user.userStatus == "BUSY" && (
                        <div className={`${style["friend-section-profile"]} ${style["friend-section-profile-busy"]}`}>
                          <img src={user.userImg}></img>
                        </div>)
                      }
                      {/* 미접속 */}
                      { (user.userStatus == "OFFLINE"  || user.userStatus == null) && (
                        <div className={`${style["friend-section-profile"]} ${style["friend-section-profile-offline"]}`}>
                          <img src={user.userImg}></img>
                        </div>)
                      }
                      {/* 프사 영역 끝  */}                        {/* 언어 */}
                      <div className={`${style.language}`}>{user.userLng}</div>                        {/* 이름 영역 */}
                      <div className={`${style["user-name"]}`}>
                        <div>{user.userId}</div>
                        <div className={`${style.name1}`}>{user.userName}</div>
                      </div>                        {/* <div className={`${style.status1}`}>{user.userStatus}</div> */}                        <div className={`${style.add}`}>
                        <AddFriendButton userId={userInfo.userId} friendId={user.userId} />    
                      </div>
                    </div>
                  ))}
                </div>
                ) 
                : 
                (
                  <p className={`${style["no-results-message"]}`}>{t(`searchFind.searchFind16`)}</p>
                )
              }
          </div>
        </div>
    </div>
    }
    </>
  );
}
export default FriendSearch;