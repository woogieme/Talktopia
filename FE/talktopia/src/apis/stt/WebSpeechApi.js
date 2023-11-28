import SockJS from 'sockjs-client';
import Stomp from "stompjs";
import axios from "axios";

import { useEffect, useState } from "react";
// import { SpeechRecognition } from "useSpeechRecognition";
import { REACT_APP_X_RAPID_API_KEY } from "../../utils";

function WebSpeechApi(){
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "ko-KR";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    const sockJs = new SockJS("http://192.168.31.231:5000/audio-stream");
    // eslint-disable-next-line
    const stomp = Stomp.over(sockJs);

    const [name, setName] = useState(""); //이름 입력
    const [interimTranscripts, setInterimTranscripts] = useState(""); //중간 결과
    const [transcript, setTranscript] = useState(""); //말한 텍스트
    const [i, setI] = useState(0);
    // eslint-disable-next-line
    const [finalTranscripts, setFinalTranscripts] = useState(""); //전달할 텍스트
    const [message, setMessage] = useState("");
    const [sender, setSender] = useState("");
    const [content, setContent] = useState("");

    //번역
    const [translatedText, setTranslatedText] = useState('');
    const GOOGLE_CLIENT_SECRET = REACT_APP_X_RAPID_API_KEY;

    useEffect(()=>{
        console.log("i", i)
     },[i]);

     useEffect(()=>{
        connect1();
        console.log("몇 번 실행하는지 보겠음")
     });


    const onHandleName = (e) => {
        setName(e.target.value);
    }

    //음성 인식 시작
    const startVoice = () => {
        recognition.start();
        console.log("말 시작");
    };

    //음성 인식 끝
    const stopVoice = () => {
        recognition.stop();
        console.log("말 끝");
    };



    // 웹소켓에 전달하는 기능
    // 사용자의 이름과 음성인식 결과를 서버로 전송
    const send = (finalTranscript) => {
        const sendMessage = {
            "sender": name,
            "content": finalTranscript
        }
        stomp.send("/app/sendText", {}, JSON.stringify(sendMessage));
    }


    // 웹소켓 연결 - 요청 없이 나랑 연결할래?
    const connect1 = () => {
        console.log("안 올력ㅇ?")
        stomp.connect({}, (frame) => {
            stomp.subscribe("/topic/getText/", (message) => {
                console.log("JSON.parse(message.body)", JSON.parse(message.body));
                showMessage(JSON.parse(message.body));
            })
        })
    };

    const showMessage = (message) => {
        console.log("혹시 여기를 안 오는건가")
        setSender(message.sender);
        setContent(message.content);
    };

    

    recognition.onresult = (e) => {
        console.log(e.results);
    
        // e.results 배열의 마지막 인덱스를 가져와서 처리합니다.
        const lastResult = e.results[e.results.length - 1];
        console.log("lastResult : ", lastResult);
        setTranscript(lastResult[0].transcript);
    
        // isFinal 프로퍼티를 통해 해당 결과가 최종 결과인지 확인합니다.
        if (lastResult.isFinal) {
          setFinalTranscripts(lastResult[0].transcript);
          setInterimTranscripts("");
          setI((i) => i + 1); // 최종 결과가 나왔을 때만 i 값을 증가시킵니다.
          console.log("FinalTranscripts : ", lastResult[0].transcript, ", interimTranscripts : ", interimTranscripts, ", i : ", i );
    
          // 말 다했으면 웹소켓으로 전달
          send(lastResult[0].transcript);
        } else {
            console.log("여기오니")
          setInterimTranscripts((prevState) => prevState + transcript);
        }
        setMessage(lastResult[0].transcript + interimTranscripts);
        translationHandler();
      };



    const translationHandler = async () => {
        const data = {
            'q': message,
            'target': 'en', //나랑 대화하는 상대의 언어
            'source': 'ko', //나의 언어
        }
        console.log("data:", data)

        const options = {
            method: 'POST',
            url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': GOOGLE_CLIENT_SECRET,
                'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
            },
            data: data,
        };
    
        try {
            const response = await axios.request(options);
            console.log(response.data);
                  
            // 이스케이프 문자열 디코딩
            const parser = new DOMParser();
            const decodedText = parser.parseFromString(response.data.data.translations[0].translatedText, 'text/html').body.textContent;

            setTranslatedText(decodedText);
        } catch (error) {
            console.error(error);
            setTranslatedText('번역에 실패하였습니다.');
        }
    }
    
    return(
        <div>
            <p>이름 입력</p>
            <input type="text" value={name} onChange={onHandleName}></input>
            <button onClick={startVoice}>시작</button>
            <button onClick={stopVoice}>스탑</button><br/>
            <p>이름 : {name} </p>
            <p>결과 출력</p>
            <p>{message}</p><br/>
            <p>번역</p>
            <p>{translatedText}</p><br/>
            <br/><p>전체 메세지</p>
            <p>{sender}가 보내는 메세지 : {content}</p>
            <button onClick={translationHandler}>클릭</button>
        </div>
    )
}

export default WebSpeechApi;