import axios from 'axios';
import { useState } from 'react';
import { REACT_APP_X_RAPID_API_KEY } from "../../utils";

function GoogleTranslator() {
    const [text, setText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const GOOGLE_CLIENT_SECRET = REACT_APP_X_RAPID_API_KEY;
    const translationHandler = async () => {

        // const encodedParams = new URLSearchParams();
        // encodedParams.set('q', text);
        // encodedParams.set('target', 'en');
        // encodedParams.set('source', 'ko');
        const data = {
            'q': text,
            'target': 'en', //나랑 대화하는 상대의 언어
            'source': 'ko', //나의 언어
        }

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
    
    const textChangeHandler = (e) => {
        setText(e.target.value);
    };

    return (
        <div>
            <input 
                type='text'
                value={text}
                placeholder='번역할 문장을 입력하세요'
                onChange={textChangeHandler}
            />
            <button onClick={translationHandler}>번역하기</button>
            <p>번역 결과: {translatedText}</p>
        </div>
    )

};

export default GoogleTranslator;