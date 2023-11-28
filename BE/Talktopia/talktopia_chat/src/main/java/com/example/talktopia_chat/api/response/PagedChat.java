package com.example.talktopia_chat.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@Builder
public class PagedChat {
	private String scrcSenderId;
	private String scrcSendTime;
	private String scrcContent;
}
