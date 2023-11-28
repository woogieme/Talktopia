package com.example.stt_test_ws;// package com.example.chattest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class SttController {
	@Autowired
	SttService sttService = new SttService();

	// 클라이언트가 send 하는 경로
	//stompConfig에서 설정한 applicationDestinationPrefixes와 @MessageMapping 경로가 병합됨
	// /app/send
	@MessageMapping("/send")
	@SendTo("/topic/sub")     // 메세지 전송하는곳
	public String streamText(@Payload byte[] audioData) {
		System.out.println("handle message, 오디오: "+audioData.toString());

		// WebSocketMessage<String> resMessage = new TextMessage("오디오를 받았단다");
		// return "오디오를 받았단다";

		// stt 실행하여 오디오데이터를 문자열로 뿌림
		String res = null;
		try {
			// res = sttService.syncRecognizeAudio(audioData);
			res = sttService.streamingRecognizeFile(audioData);
			// res= sttService.asyncRecognizeGcs(audioData);
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("결과: "+res);
		return res;
	}

	// 텍스트로 변환된 오디오를 subscriber들에게 전송
	@MessageMapping("/sendText")
	// @SendTo("/topic/getText")
	@SendTo("/topic/getText/{ssessionId}")
	public SendedMessage sendText(@Payload SendedMessage sendedMessage){
		// System.out.println(sendedMessage.toString());

		return sendedMessage;
	}
}
