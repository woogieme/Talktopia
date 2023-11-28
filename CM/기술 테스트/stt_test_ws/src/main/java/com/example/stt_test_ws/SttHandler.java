// import org.springframework.web.socket.CloseStatus;
// import org.springframework.web.socket.TextMessage;
// import org.springframework.web.socket.WebSocketHandler;
// import org.springframework.web.socket.WebSocketMessage;
// import org.springframework.web.socket.WebSocketSession;
//
// // stomp 안쓰는 기본 웹소켓에서 쓰는거임. stomp에선 필요없음
// public class SttHandler implements WebSocketHandler {
//
// 	// @Override
// 	// protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
// 	// 	// Handle the audio stream here
// 	// 	String audioData = message.getPayload(); // This will be the audio data from the client
// 	// 	// Process the audio data, save it, or send it to other clients if needed
// 	//
// 	// }
//
// 	@Override
// 	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
// 		System.out.println("접속");
// 	}
//
// 	@Override
// 	public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
// 		System.out.println("접속 끝");
// 	}
//
// 	@Override
// 	public boolean supportsPartialMessages() {
// 		return false;
// 	}
//
// 	@Override
// 	public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
// 		byte[] encodedAudio = (byte[])message.getPayload();
// 		System.out.println("handle message, 오디오: "+encodedAudio);
//
// 		WebSocketMessage<String> resMessage = new TextMessage("오디오를 받았단다");
// 		session.sendMessage(resMessage);
// 	}
//
// 	@Override
// 	public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
// 		System.err.println("WebSocket transport error: " + exception.getMessage());
// 	}
// }
