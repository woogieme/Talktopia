importScripts("https://www.gstatic.com/firebasejs/8.7.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.7.1/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey:
  authDomain:
  projectId:
  storageBucket:
  messagingSenderId:
  appId:
  measurementId:
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  
  // 메인 스레드에 메시지를 전달하여 모달을 표시하도록 합니다.
  clients.matchAll({
    includeUncontrolled: true,
    type: 'window'
  }).then(clientList => {
    if (clientList.length > 0) {
      clientList[0].postMessage(payload);
    }
  });
});