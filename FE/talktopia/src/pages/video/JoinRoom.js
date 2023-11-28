import { OpenVidu } from 'openvidu-browser';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import axios from 'axios';
import SockJS from 'sockjs-client'; // <-- 수정
import Stomp from "stompjs";        // <-- 수정

import UserVideoComponent from '../../components/video/UserVideoComponent'
import ToolbarComponent from '../../components/video/ToolbarComponent';
import Chat from '../../components/video/Chat'
import ConversationLog from '../../components/video/ConversationLog';
import ReportModalComponent from '../../components/video/ReportModalComponent';
import InviteModalComponent from '../../components/video/InviteModalComponent';
import TopicModalComponent from '../../components/video/TopicModalComponent';
import { BACKEND_URL } from '../../utils';

import style from './JoinRoom.module.css'

// 세션 입장
function JoinRoom() {
    const user = useSelector((state) => state.userInfo);    // Redux 정보

    const navigate = useNavigate();
    const location = useLocation();

    const [localUser, setLocalUser] = useState(undefined);  // subscribers 요소에 들어갈 거임. 그러면서 publisher 역할도 함.
    
    // session, state 선언
    const [session, setSession] = useState(undefined)
    const [subscribers, setSubscribers] = useState([]);
    const [mySessionId, setMySessionId] = useState(undefined);  

    // 방의 모든 참여자의 역할 정보 <----------------------------------------------------
    const initialRoomRoles = useRef(undefined);

    // 토큰, 방 타입 관리
    const [openviduToken, setOpenviduToken] = useState(undefined);
    const [roomType, setRoomType] = useState(undefined);

    // Layout 및 참여자 수
    const [participantCount, setParticipantCount] = useState(1)
    const participantCountRef = useRef(1)
    // console.log(participantCount)
    const layoutPlan = {
        1: style.oneParticipant,
        2: style.twoParticipants,
        3: style.threeParticipants,
        4: style.fourParticipants,
        5: style.fiveParticipants,
        6: style.sixParticipants
      };

    // 새로운 OpenVidu 객체 생성
    const [OV, setOV] = useState(<OpenVidu />);

    const sessionRef = useRef(undefined);   // session값 ref
    const userDataRef = useRef(undefined);  // session Id, user Id 값 ref
    const userRollRef = useRef(undefined);  // userRoll 정보

    // socket 통신
    const sockJs = new SockJS(`${BACKEND_URL}/ws`);
    const stomp = Stomp.over(sockJs);

    // HOST 정보
    const [hostId, setHostId] = useState(undefined);


    // 2) 화면 렌더링 시 최초 1회 실행
    useEffect(() => {
        if (location.state === null || location.state.mySessionId === null || location.state.token === null || location.state.roomRole === null) {
            console.log("location.state의 정보가 없습니다.");
            navigate("/home");
            return;
        };

        setMySessionId(location.state.mySessionId);
        setOpenviduToken(location.state.token);
        setRoomType(location.state.roomType);

        const state = {
            userId: user.userId,
            userName: user.userName,
            roomRole: location.state.roomRole,
            isVideoActive: true,
            isAudioActive: true,
            streamManager: undefined,
            connectionId: undefined
        }
        setLocalUser((prev) => ({...prev, ...state}))

        const userData = { 
            mySessionId: location.state.mySessionId, 
            myUserId: user.userId,
        }
        userDataRef.current = userData
        userRollRef.current = location.state.roomRole

        // 방 역할 정보 객체로 변환
        const userRoles = location.state.allRoomRoles.reduce((acc, user) => {
            acc[user.userId] = user.vroomRole;
            return acc;
        }, {});
        initialRoomRoles.current = userRoles

        // 웹 소켓 연결
        stomp.connect({}, (frame) => {
            stomp.subscribe(`/topic/room/${location.state.mySessionId}`, (message) => {
                const receivedData = JSON.parse(message.body)
                if (typeof receivedData === 'string') {
                    console.log('이건 게스트가 나갈때 응답')
                } else if (typeof receivedData === 'object') {  // host 나갔을 때 오는 응답
                    console.log('호스트나갔을 때 웹소켓 응답 데이터', receivedData)
                    setHostId(receivedData.userId)
                }
                console.log("JSON.parse(message.body)", JSON.parse(message.body));
            })
        })

        // 주제 목록 불러오기
        getTopicList();

        // 윈도우 객체에 화면 종료 이벤트 추가
        window.addEventListener('beforeunload', onBeforeUnload); 
        joinSession();  // 세션 입장

        return () => {
            // 윈도우 객체에 화면 종료 이벤트 제거
            window.removeEventListener('beforeunload', onBeforeUnload);
            if (sessionRef.current !== undefined) {
                leaveSession(); // 세션 나가기
            }
        };
    }, []);

    // 페이지를 언로드하기 전에 leaveSession 메서드를 호출
    const onBeforeUnload = () => {
        leaveSession();
    }

    // 세션 나가기
    const leaveSession = async () => {

        if (sessionRef.current) {
            sessionRef.current.disconnect();
            await leaveSessionHandler();
        }

        if (participantCountRef.current === 1) {
            await sendLogToServer();
        }

        // session, state 초기화
        setOV(null);
        setLocalUser(undefined);
        setSession(undefined);
        setSubscribers([]);
        setMySessionId(undefined);

        sessionRef.current = undefined;
        userDataRef.current = undefined;
        userRollRef.current = undefined;
        stomp.disconnect();

        navigate('/home');
    };

    // 세션 떠날 때 요청
    const leaveSessionHandler = async () => {
        const exitRequest = {
            userId: userDataRef.current.myUserId,
            token: user.accessToken,
            vrSession: userDataRef.current.mySessionId,
            roomRole: userRollRef.current
        };
        console.log('세션 종료시 전달하는 데이터', exitRequest)
        stomp.send("/app/api/v1/room/exit/"+userDataRef.current.mySessionId, {}, JSON.stringify(exitRequest));
    };

    // 세션 생성 및 세션에서 이벤트가 발생할 때의 동작을 지정 
    const joinSession = async () => {

        const newOV = new OpenVidu();
        let mySession = newOV.initSession();

        // Session 개체에서 추가된 subscriber를 subscribers 배열에 저장 
        mySession.on('streamCreated', (event) => {
            const subscriber = mySession.subscribe(event.stream, undefined);
            const jsonParts = event.stream.connection.data.split('%/%');
            const clientData = JSON.parse(jsonParts[0]).clientData

            let currentUserRole;
            if (
                initialRoomRoles.current && 
                Object.keys(initialRoomRoles.current).length !== 0 && 
                clientData.userId in initialRoomRoles.current
                ) {
                currentUserRole = initialRoomRoles.current[clientData.userId];

                const updatedInitialRoomRoles = { ...initialRoomRoles.current };
                delete updatedInitialRoomRoles[clientData.userId];
                initialRoomRoles.current = updatedInitialRoomRoles;
            } else {
                currentUserRole = clientData.roomRole;
            }

            const newUser = {
                userId: clientData.userId,
                userName: clientData.userName,
                // roomRole: clientData.roomRole,
                roomRole: currentUserRole,
                nation: clientData.nation,
                isVideoActive: event.stream.videoActive,
                isAudioActive: event.stream.audioActive,
                streamManager: subscriber,
                connectionId: event.stream.connection.connectionId
            }

            setSubscribers((prev) => [...prev, newUser]);   // 새 구독자에 대한 상태 업데이트
            console.log(newUser.userId, "님이 접속했습니다.");
            setParticipantCount((prev) => (prev + 1))       // 참여자 수 증가
            participantCountRef.current += 1
        });

        // Session 개체에서 제거된 관련 subsrciber를 subsribers 배열에서 제거
        mySession.on('streamDestroyed', (event) => {
            setSubscribers((preSubscribers) => preSubscribers.filter((subscriber) => subscriber.streamManager !== event.stream.streamManager));
            setParticipantCount((prev) => (prev - 1))       // 참여자 수 감소
            participantCountRef.current -= 1
            // console.log(JSON.parse(event.stream.connection.data).clientData, "님이 접속을 종료했습니다.");        
        });

        // 서버 측에서 예기치 않은 비동기 오류가 발생할 때 Session 개체에 의해 트리거 되는 이벤트
        mySession.on('exception', (exception) => {
            console.warn(exception);
        });

        // 세션 갱신
        setOV(newOV);
        setSession(mySession);
        sessionRef.current = mySession;
    };

    // 토큰 전달
    const getToken = async () => {
        return openviduToken
    };

    // 사용자의 토큰으로 세션 연결 (session 객체 변경 시에만 실행)
    useEffect(() => {
        if (session && openviduToken) {
            getToken().then((token) => {
                // 첫 번째 매개변수는 OpenVidu deployment로 부터 얻은 토큰, 두 번째 매개변수는 이벤트의 모든 사용자가 검색할 수 있음.
                session.connect(token, { clientData: {
                    userId: localUser.userId, 
                    userName: localUser.userName,
                    roomRole: localUser.roomRole,
                    nation: user.sttLang
                }})
                .then(async () => {
                    // Get your own camera stream ---
                    // publisher 객체 생성
                    let publisher = await OV.initPublisherAsync(undefined, {
                        audioSource: undefined,     // The source of audio. If undefined default microphone
                        videoSource: undefined,     // The source of video. If undefined default webcam
                        publishAudio: localUser.isAudioActive, // Whether you want to start publishing with your audio unmuted or not
                        publishVideo: localUser.isVideoActive, // Whether you want to start publishing with your video enabled or not
                        resolution: '640x480',      // The resolution of your video
                        frameRate: 30,              // The frame rate of your video
                        insertMode: 'APPEND',       // How the video is inserted in the target element 'video-container'
                        mirror: true,               // Whether to mirror your local video or not
                    });
                    // Publish your stream ---
                    session.publish(publisher);
                    // Set the main video in the page to display our webcam and store our Publisher
                    setLocalUser((prev) => ({...prev, connectionId: publisher.stream.connection.connectionId, streamManager: publisher}));
                })
                .catch ((error) => {
                    console.log(error);
                    alert("세션 연결 오류");
                    navigate("/");
                });
            });
        }
    }, [session]);



    // 내 웹캠 on/off (상대방도 화면 꺼지는지 확인 필요)
    const toggleVideo = () => {
        if (localUser.streamManager) {
            const enabled = !localUser.isVideoActive;
            setLocalUser((prev) => ({...prev, isVideoActive: enabled}));
            localUser.streamManager.publishVideo(enabled);
        }
    };

    // 내 마이크 on/off (상대방도 음성 꺼지는지 확인 )
    const toggleAudio = () => {
        if (localUser.streamManager) {
            const enabled = !localUser.isAudioActive;
            setLocalUser((prev) => ({...prev, isAudioActive: enabled}));
            localUser.streamManager.publishAudio(enabled);
        }
    };

    // 신고 모달 창
    const [isReportModalOpen, setIsReportModalOpen] = useState(false)
    const [isReportUserId, setIsReportUserId] = useState(undefined)

    const openReportModal = (userId) => {
        setIsReportUserId(userId)
        setIsReportModalOpen(true);
    }

    const closeReportModal = () => {
        setIsReportModalOpen(false);
    }

    // 친구 초대 모달 창
    const [inviteFriendsList, setInviteFriendsList] = useState(undefined);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    // 친구 초대 목록 조회
    const inviteFriends = async () => {
        const headers = {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${user.accessToken}`
        }

        axios.get(`${BACKEND_URL}/api/v1/friend/list/${user.userId}`, { headers })
        .then((response) => {
            let friendList = response.data
            setInviteFriendsList((prev)=>friendList);     
            setIsInviteModalOpen(true);
        })
        .catch((error) => {
            console.log("에러 발생", error);
        })
    }
    const closeInviteModal = () => {
        setIsInviteModalOpen(false);
    }

    // 주제 리스트
    const [topicList, setTopicList] = useState(undefined);      // 토픽 리스트 저장
    const [topicTitle, setTopicTitle] = useState(undefined);
    const getTopicList = () => {
        const headers = {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${user.accessToken}`
        }

        axios.get(`${BACKEND_URL}/api/v1/topic/start/${user.sttLang}`, { headers })
        .then((response) => {
            const shuffledData = shuffleTopic(response.data.topicList)
            const newTopicTitle = response.data.title
            setTopicList(shuffledData);     
            setTopicTitle(newTopicTitle)
            console.log(shuffledData)
        })
        .catch((error) => {
            console.log("에러 발생", error);
        }) 
    }

    const shuffleTopic = (arr) => {
        let m = arr.length
        let temp;
        let idx;

        while (m) {
            idx = Math.floor(Math.random() * m--)
            temp = arr[m]
            arr[m] = arr[idx]
            arr[idx] = temp
        }
        return arr
    }

    // 주제 시작 및 종료시 Toolbar 버튼 변경
    const [isTopicbar, setIsTopicbar] = useState(false)
    const openTopicbar = () => {
        setIsTopicbar(true)
    }
    const closeTopicbar = () => {
        setIsTopicbar(false)
    }

    // 주제 모달 창
    const [isTopic, setIsTopic] = useState(false)
    const openTopic = () => {
        setIsTopic(!isTopic)
    }

    // 세션 종료시 대화로그 및 채팅 저장
    // const [chatLog, setChatLog] = useState([])
    // const [conversationLog, setConversationLog] = useState([])
    const chatLogRef = useRef([])
    const conversationLogRef = useRef([])

    const chatLogHandler = (sender, message) => {
        console.log('chatLog message: ', message)

        let newChatLog = {
            sender: sender,
            message: message
        }
        // setChatLog((prev)=>([...prev, newChatLog]))
        chatLogRef.current.push(newChatLog)
    }

    const conversationLogHandler = (sender, message) => {
        console.log('conversationLog message: ', message)
        let newChatLog = {
            sender: sender,
            message: message
        }
        // setConversationLog((prev)=>([...prev, newChatLog]))
        conversationLogRef.current.push(newChatLog)

    }

    const sendLogToServer = async () => {
        let emptyData = {
            sender: '',
            message: ''
        }
        if (chatLogRef.current == []) {
            chatLogRef.current.push(emptyData)
        }
        if (conversationLogRef.current == []) {
            conversationLogRef.current.push(emptyData)
        }
        console.log(chatLogRef.current)
        console.log(conversationLogRef.current)

        const headers = {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${user.accessToken}`
        }
        
        const requestBody = {
            vrSession: userDataRef.current.mySessionId,
            conversationLog: conversationLogRef.current,
            chatLog: chatLogRef.current
        };
        console.log('레디스로 보내는 데이터 정보', requestBody)
        const requestBodyJSON = JSON.stringify(requestBody);

        await axios
        .post(`${BACKEND_URL}/api/v1/saveChatLog/saveLog`, requestBodyJSON, {headers})   // 여기부터 다시 수정해야함.
        .then((response) => {
            console.log(response.data)
        })
        .catch((error) => {
            console.log("에러 발생", error);
        })
    }

    // 유저 권한 업데이트
    const changeUserRoll = (data) => {
        console.log('제발 떠라', subscribers)
        if (data === user.userId) { 
            setLocalUser((prev) => ({...prev, roomRole: 'HOST'}))
            userRollRef.current = 'HOST'
            
        } else if (data !== user.userId) {
            const updatedSubscribers = subscribers.map((userObj) => {
                if (userObj.userId === data) {
                    return { ...userObj, roomRole: 'HOST'};
                }
                return userObj; // 조건을 만족하지 않는 객체는 그대로 반환
            })
            setSubscribers(updatedSubscribers)
        }
    };

    useEffect(() => {
        console.log('현재 호스트',hostId)
        changeUserRoll(hostId);
    }, [hostId])


    return (
        <div>
            {sessionRef.current !== undefined && localUser.streamManager != undefined ? (
                <div className={style['app-container']}> 
                    <div className={style['app-main']}>
                        <div className={style['video-container']}>
                            <div className={style['video-call-wrapperr']}>
                                <div className={`${style['video-participant']} ${layoutPlan[participantCount]}`}>
                                    <UserVideoComponent 
                                        userId={ localUser.userId }
                                        userName={ localUser.userName }
                                        roomRole={ localUser.roomRole }
                                        nation={ user.sttLang }
                                        streamManager={ localUser.streamManager }
                                        participantCount={ participantCount }
                                    />
                                </div>
                                
                                {subscribers.map((sub, i) => (
                                    <div key={`${i}-subscriber`} className={`${style['video-participant']} ${layoutPlan[participantCount]}`}>
                                        <UserVideoComponent 
                                            userId={ sub.userId }
                                            userName={ sub.userName }
                                            roomRole={ sub.roomRole }
                                            nation={ sub.nation }
                                            streamManager={ sub.streamManager }
                                            participantCount={ participantCount }
                                            openReportModal = { openReportModal }
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className={style['video-div-line']}></div>

                        <div className={style['video-action-container']}>
                            <ToolbarComponent
                                roomType={ roomType }
                                videoEnabled={ localUser.isVideoActive }
                                audioEnabled={ localUser.isAudioActive }
                                toggleAudio={ toggleAudio }
                                toggleVideo={ toggleVideo }
                                inviteFriends={ inviteFriends }
                                leaveSession={ leaveSession }
                                isTopicbar={ isTopicbar }
                                openTopicbar= { openTopicbar }
                                closeTopicbar={ closeTopicbar }
                                roomRole={ localUser.roomRole }
                                openTopic={ openTopic }
                            />
                        </div>
                    </div>
                    
                    {localUser.userId !== undefined && localUser.streamManager !== undefined && (
                        <div className={style['right-side']}>
                            <div className={style['conversation-container']}>
                                <ConversationLog
                                    isAudioActive={ localUser.isAudioActive }
                                    myUserId={ localUser.userId }
                                    myUserName={ localUser.userName }
                                    mainStreamManager={ localUser.streamManager }
                                    conversationLogHandler={ conversationLogHandler }
                                    vrSession={ userDataRef.current.mySessionId }
                                />
                            </div>   
                            <div className={style['chat-container']}>
                                <Chat
                                    myUserId={ localUser.userId }
                                    myUserName={ localUser.userName }
                                    mainStreamManager={ localUser.streamManager }
                                    chatLogHandler={ chatLogHandler }
                                    vrSession={ userDataRef.current.mySessionId }
                                />
                            </div>
                        </div>
                    )}

                    {localUser.userId !== undefined && localUser.streamManager !== undefined && (
                        <>
                            <TopicModalComponent 
                                isTopic = { isTopic }
                                topicTitle={ topicTitle }
                                topicList={ topicList }
                                mainStreamManager={ localUser.streamManager }
                            />
                        </>
                    )}

                </div>
            ) : null}

            {isReportModalOpen ? (
                <div className={style['report-modal-window']} onClick={closeReportModal}>
                    <ReportModalComponent 
                        vrSession={ userDataRef.current.mySessionId }
                        reportUserId={ isReportUserId }
                        closeReportModal={ closeReportModal }
                    />
                </div>
            ) : null}

            {isInviteModalOpen ? (
                <div className={style['report-modal-window']} onClick={closeInviteModal}>
                    <InviteModalComponent
                        vrSession={ userDataRef.current.mySessionId }
                        inviteFriendsList={ inviteFriendsList }
                        closeInviteModal={ closeInviteModal }
                    />
                </div>
            ) : null}
        </div>
    );
}

export default JoinRoom;
