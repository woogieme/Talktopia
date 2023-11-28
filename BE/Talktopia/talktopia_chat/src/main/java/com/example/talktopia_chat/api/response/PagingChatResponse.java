package com.example.talktopia_chat.api.response;

import java.util.List;

import com.example.talktopia_chat.db.entity.SaveChatRoomContent;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * MySQL에서 페이징된 채팅로그
 * */
@AllArgsConstructor
@Getter
@Setter
public class PagingChatResponse {
	private List<PagedChat> chatList; // 채팅 로그
	private Boolean hasNext;  // 다음 리스트 존재 여부
}
