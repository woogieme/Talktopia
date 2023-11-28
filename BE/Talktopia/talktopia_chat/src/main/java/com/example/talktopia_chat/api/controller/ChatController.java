package com.example.talktopia_chat.api.controller;// package com.example.chattest;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.talktopia_chat.api.request.EnterChatRequest;
import com.example.talktopia_chat.api.request.PagingChatRequest;
import com.example.talktopia_chat.api.response.EnterChatResponse;
import com.example.talktopia_chat.api.response.PagingChatResponse;
import com.example.talktopia_chat.api.service.ChatService;
import com.example.talktopia_chat.api.service.SaveChatRoomContentRedisService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/chat")
public class ChatController {
	private final ChatService chatService;
	private final SaveChatRoomContentRedisService scrcService;

	/**
	 * 참여자와 상대방의 채팅방 입장.
	 * 채팅한 적 없을 시 채팅방 만들고 입장함.
	 * @param enterChatRequest    userId, friendId
	 * @return session + 대화내역
	 * */
	@PostMapping("/enter")
	public ResponseEntity<EnterChatResponse> enterChat(@RequestBody EnterChatRequest enterChatRequest) {
		System.out.println("/enter call");
		String userId = enterChatRequest.getUserId();
		String friendId = enterChatRequest.getFriendId();
		System.out.println("user, friend: " + userId + ", " + friendId);

		// userId와 friendId로 세션아이디 가져옴
		String sessionId = chatService.enterChat(userId, friendId);

		// 세션아이디로 대화내역 불러오기
		EnterChatResponse enterChatResponse = scrcService.getRedisChat(sessionId);

		return ResponseEntity.ok().body(enterChatResponse);
	}

	/**
	 * @param pagingChatRequest
	 *     - sessionId
	 *     - sendTime
	 *
	 * */
	@PostMapping("/scroll")
	public ResponseEntity<PagingChatResponse> pagingChat(@RequestBody PagingChatRequest pagingChatRequest) {
		System.out.println("/scroll call");

		// sessionId로 mysql에서 새 데이터 긁어오기
		PagingChatResponse res = chatService.getPagingChat(pagingChatRequest.getSessionId(),
			pagingChatRequest.getLastSendTime());
		return ResponseEntity.ok(res);
	}
}
