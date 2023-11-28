package com.example.talktopia_chat.api.request;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

/**
 * DB에서 채팅 로그 받아올 때를 위한 request.
 * /api/v1/chat/scroll 에서 쓰임
 * */
@Getter
@Setter
public class PagingChatRequest {
	private String sessionId; // 채팅방 세션
	private String lastSendTime;  // 채팅 보내진 시간
}
