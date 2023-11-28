package com.example.talktopia_chat.api.response;

import java.util.List;

import com.example.talktopia_chat.db.entity.SaveChatRoomContentRedis;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class EnterChatResponse {
	private String sessionId;
	private List<SaveChatRoomContentRedis> chatList;
}
