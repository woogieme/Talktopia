import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BACKEND_URL } from '../../utils';
import { useTranslation } from "react-i18next";

import { REACT_APP_X_RAPID_API_KEY } from "../../utils";
import style from './Chat.module.css';

function Chat(props) {
    const user = useSelector((state) => state.userInfo);
    const { t } = useTranslation();
    const [messageList, setMessageList] = useState([]);
    const [message, setMessage] = useState('');
    const chatScroll = useRef(null);

    useEffect(() => {
        // Receiver of the message (usually before calling 'session.connect')
        props.mainStreamManager.stream.session.on('signal:chat', async (event) => {
            const data = JSON.parse(event.data);
            let translatedMessage;
            if (props.myUserId !== data.sendUserId ) {  // 전달받은 메세지가 본인 메세지가 아닌 경우
                translatedMessage = await translationHandler(data.message, data.sourceLang, user.transLang);
            } else {
                translatedMessage = data.message;
            }

            let newMessageList = ({
                connectionId: event.from.connectionId,  // Connection object of the sender 
                sendUserId: data.sendUserId, 
                sendUserName: data.sendUserName,
                message: translatedMessage              // Message
            });
            props.chatLogHandler(data.sendUserId, data.message)
            setMessageList((prev) => ([...prev, newMessageList]))
            scrollToBottom();
        });
    }, []);

    // 아래는 메세지 보내는 것 관련 -----------------------------
    const messageChangeHandler = (e) => {
        setMessage(e.target.value)
    };

    const keyPressHandler = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const sendButtonClick = (e) => {
        e.preventDefault();
        sendMessage();
    }

    // 연결된 모든 참가자에게 broadcast message로 메세지 보내기 
    const sendMessage = () => {
        let newMessage = message.replace(/ +(?= )/g, '');
        if (newMessage !== '' && newMessage !== ' ') {
            const data = {
                message: message, 
                sendUserId: props.myUserId, 
                sendUserName: props.myUserName,
                streamId: props.mainStreamManager.stream.streamId,
                sourceLang: user.transLang
            };
            // Sender of the message (after 'session.connect')
            props.mainStreamManager.stream.session.signal({
                data: JSON.stringify(data), // Any string (optional)
                to: [],                     // Array of Connection objects (optional. Broadcast to everyone if empty)
                type: 'chat',               // The type of message (optional)
            })
            .then(() => {
                console.log('메세지가 성공적으로 보내졌습니다.');
            })
            .catch((error) => {
                console.log(error);
            });
        }
        setMessage('');
    };

    // Rapid API translation
    const translationHandler = async (text, sourceLanguage, targetLanguage) => {
        const encodedParams = new URLSearchParams();
        encodedParams.set('source_language', sourceLanguage)        // 전달 받은 텍스트 언어
        encodedParams.set('target_language', targetLanguage)        // 번역할 언어
        encodedParams.set('text', text)

        console.log('translationHandler data', encodedParams)

        const options = {
            method: 'POST',
            url: 'https://text-translator2.p.rapidapi.com/translate',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': REACT_APP_X_RAPID_API_KEY,
                'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
            },
            data: encodedParams,
        };
            
        try {
            const response = await axios.request(options);
            let translatedText = response.data.data.translatedText
            console.log('번역에 성공하였습니다.', translatedText)
            return translatedText
        } catch (error) {
            console.error(error);
            // alert('번역에 실패하였습니다.');
            return text
        }
    };

    // papago API 테스트
    // const translationHandler = async (text, sourceLanguage, targetLanguage) => {
    
    //     const headers = {
    //         'Content-Type' : 'application/json',
    //         'Authorization': `Bearer ${user.accessToken}`
    //     }
        
    //     const requestBody = {
    //         text: text,
    //         targetLang: targetLanguage,
    //         sourceLang: sourceLanguage
    //     };

    //     const requestBodyJSON = JSON.stringify(requestBody);

    //     try {
    //         const response = await axios.post(`${BACKEND_URL}/api/v1/naver/translate`, requestBodyJSON, {headers})
    //         let translatedText = response.data
    //         console.log('번역에 성공하였습니다.', translatedText)
    //         return translatedText
    //     } catch (error) {
    //         console.error(error);
    //         // alert('번역에 실패하였습니다.');
    //         return text
    //     }
    // };

    const scrollToBottom = () => {
        setTimeout(() => {
            try {
                chatScroll.current.scrollTop = chatScroll.current.scrollHeight;
            } catch (err) {}
        }, 20);
    }

    return (
        <>
            <div className={style['chat-title']}>
            <p className={style['chat-title-text']}>{t(`Chat.Chat1`)}</p>
            </div>

            <div className={style['chat-div-line']}></div>


            <div className={`${ style.message_wrap }`} ref={chatScroll}>
                {messageList.map((data, i) => (
                    <div 
                        key={`${i}-Chat`}
                        id="remoteUsers"
                        className={
                            `${style.message} ${ data.connectionId !== props.mainStreamManager.session.connection.connectionId ? style.left : style.right }`
                        }
                    >
                        <div className={ `${style.msg_detail }`}>
                            <div className={ `${style.msg_info }`}>
                                <p> {data.sendUserName}</p>
                            </div>
                            <div className={ `${style.msg_content }`}>
                                <p className={ `${style.text }`}>{data.message}</p>
                            </div>
                        </div>
                    </div>
                ))}

            </div>

            <div className={style['message-input-container']}>
                <input
                    placeholder={t(`Chat.Chat2`)}
                    className={style['message-input']}
                    value={message}
                    onChange={messageChangeHandler}
                    onKeyPress={keyPressHandler}
                />
                <button className={style['sendButton']} onClick={sendButtonClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-send" viewBox="0 0 24 24">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                </button>
            </div>

        </>
    );
};

export default Chat;