import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BACKEND_URL } from '../../utils';
import { useTranslation } from "react-i18next";

import { REACT_APP_X_RAPID_API_KEY } from "../../utils";
import style from './CoversationLog.module.css';

function ConversationLog(props) {
    const { t } = useTranslation();
    const user = useSelector((state) => state.userInfo);
    const chatScroll = useRef(null);

    const [messageList, setMessageList] = useState([]); // 받은 메세지들

    // WebSpeechApi관련 state
    const [transcript, setTranscript] = useState(""); // 자신이 말한 텍스트


    // speech recognition toggle
    const recognitionEnableRef = useRef(false)
    const [recognition, setRecognition] = useState(null);

    if (!!props.isAudioActive && !recognitionEnableRef.current && recognition !== null) {
        recognitionEnableRef.current = true
        recognition.start();
    } else if (!props.isAudioActive && recognitionEnableRef.current && recognition !== null) {
        recognitionEnableRef.current = false
        recognition.abort();
    }


    // 메세지 전달 함수
    const sendMessage = (finalTranscript) => {
        let newMfinalTranscript = finalTranscript.replace(/ +(?= )/g, '');
        if (newMfinalTranscript !== '' && newMfinalTranscript !== ' ') {
            const data = {
                transcript: newMfinalTranscript,                    // stt 
                sendUserId: props.myUserId,                         // 말한 사용자 이름
                sendUserName: props.myUserName,
                streamId: props.mainStreamManager.stream.streamId,  // streamId (이건 다른걸로 바꿔도 무방)
                sourceLang: user.transLang                          // 번역 source 언어
            };
            // Sender of the message (after 'session.connect')
            props.mainStreamManager.stream.session.signal({
                data: JSON.stringify(data), // Any string (optional)
                to: [],                     // Array of Connection objects (optional. Broadcast to everyone if empty)
                type: 'STT',       // The type of message (optional)
            })
            .then(() => {
                console.log('음성텍스트가 성공적으로 보내졌습니다.');
            })
            .catch((error) => {
                console.log(error);
            });
        }
    };

    useEffect(() => {
        // speech recognition 설정
        const recognitionInstance = new window.webkitSpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.lang = user.sttLang;    // 음성 인식되는 언어
        recognitionInstance.interimResults = true;
        recognitionInstance.maxAlternatives = 1;
    
        // speech recognition 이벤트핸들러 시작
        recognitionInstance.onspeechend = function () {
            recognitionInstance.stop();
            console.log("speech end")
        }
    
        recognitionInstance.onerror = function (event) {
            console.log('Error occurred in recognition: ' + event.error);
        }
    
        recognitionInstance.onaudiostart = function (event) {
            //Fired when the user agent has started to capture audio.
            console.log('onaudiostart');
        }
    
        recognitionInstance.onaudioend = function (event) {
            //Fired when the user agent has finished capturing audio.
            console.log('onaudioend');
        }
    
        recognitionInstance.onend = function (event) {
            //Fired when the speech recognition service has disconnected.
            if (recognitionEnableRef.current) {
                recognitionInstance.start();
                console.log('재연결 되었습니다.')
            } else {
                console.log('한 뭉탱이 인식이 끝났습니다.');
            }
            // console.log('한 뭉탱이 인식이 끝났습니다.');
        }
    
        recognitionInstance.onnomatch = function (event) {
            //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
            console.log('nomatch');
        }
    
        recognitionInstance.onsoundstart = function (event) {
            //Fired when any sound — recognisable speech or not — has been detected.
            console.log('on sound start');
        }
    
        recognitionInstance.onsoundend = function (event) {
            //Fired when any sound — recognisable speech or not — has stopped being detected.
            console.log('on sound end');
        }
    
        recognitionInstance.onspeechstart = function (event) {
            //Fired when sound that is recognised by the speech recognition service as speech has been detected.
            console.log('onspeechstart');
        }
        recognitionInstance.onstart = function (event) {
            //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
            console.log('onstart');
        }
    
        // 음성 인식 결과 반환 시
        recognitionInstance.onresult = (e) => {
            // e.results 배열의 마지막 인덱스를 가져와서 처리합니다.
            const lastResult = e.results[e.results.length - 1];
            setTranscript(lastResult[0].transcript);  // 내가 말한 내용
    
            // isFinal 프로퍼티를 통해 해당 결과가 최종 결과인지 확인합니다.
            if (lastResult.isFinal) {                 // true이면 말 다했기에 전달함수 호출
                sendMessage(lastResult[0].transcript);  // 메세지 전달 함수 호출
            }
        };
        // speech recognition 이벤트핸들러 끝
        setRecognition(recognitionInstance)

        recognitionInstance.start();        // 마운트 시 바로 음성 인식 되게
        recognitionEnableRef.current = true // 음성 인식 활성화 확인

        // Receiver of the message (usually before calling 'session.connect')
        props.mainStreamManager.stream.session.on('signal:STT', async (event) => {
            const data = JSON.parse(event.data);

            let translatedMessage;
            if (props.myUserId !== data.sendUserId ) {  // 전달받은 메세지가 본인 메세지가 아닌 경우
                translatedMessage = await translationHandler(data.transcript, data.sourceLang, user.transLang);
            } else {
                console.log('내가 말한거')
                translatedMessage = data.transcript;
            }

            let messageData = ({
                transcript: data.transcript,            // 전달받은 메세지
                sendUserId: data.sendUserId,            // 전달한 사용자 아이디
                sendUserName: data.sendUserName,        // 전달한 사용자 이름
                connectionId: event.from.connectionId,  // Connection object of the sender 
                source: data.sourceLang,                // 전달받은 메세지 언어
                translate: translatedMessage            // 번역된 메세지 
            });
            props.conversationLogHandler(data.sendUserId, data.transcript)
            setMessageList((prev) => ([...prev, messageData]))
            scrollToBottom();
        });

        return () => {
            if (recognitionEnableRef.current) {
                recognitionEnableRef.current = false
                recognitionInstance.abort();
            }
        };
    }, []);

    // Rapid API translation
    const translationHandler = async (text, sourceLanguage, targetLanguage) => {
        const encodedParams = new URLSearchParams();
        encodedParams.set('source_language', sourceLanguage) // 전달 받은 텍스트 언어
        encodedParams.set('target_language', targetLanguage) // 번역할 언어
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

            // setMessageList((prev) => ([...prev, newMessageList]))
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
            <div className={style['convesation-title']}>
            <p className={style['conversation-title-text']}>{t(`ConversationLog.ConversationLog1`)}</p>
            </div>
            <div className={style['conversation-div-line']}></div>
    
            <div className={style['message_wrap']} ref={chatScroll}>
                {messageList.map((data, i) => (
                    <div 
                        key={`${i}-Conversation`}
                        className={
                            `${style.message} ${ data.connectionId !== props.mainStreamManager.session.connection.connectionId ? style.left : style.right }`
                        }
                    >
                        <div className={ `${style.msg_detail }`}>
                            <div className={ `${style.msg_info }`}>
                                <p>{data.sendUserName}</p>
                            </div>
                            <div className={ `${style.msg_content }`}>
                                <p className={ `${style.text }`}>{data.translate}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>  

            <div className={style['stt-transript']}>
                <p className={style['stt-transcript-text']}>{transcript}</p>
            </div>
 
        </>
    );
};

export default ConversationLog;