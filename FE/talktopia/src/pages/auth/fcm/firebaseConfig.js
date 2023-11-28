import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  // 여기에 firebase 프로젝트 설정의 firebaseConfig 값을 복사해 넣습니다.
  apiKey: "AIzaSyBDUbGRVP_9RXX8rZCj4CYA8sAXicLBI6Y",
  authDomain: "mytest-bcbb9.firebaseapp.com",
  projectId: "mytest-bcbb9",
  storageBucket: "mytest-bcbb9.appspot.com",
  messagingSenderId: "804412954342",
  appId: "1:804412954342:web:e37fc11792859e55704d27",
  measurementId: "G-R5Y8XJJ3MN"
};

const firebaseApp = initializeApp(firebaseConfig);
export const messaging = getMessaging(firebaseApp);
