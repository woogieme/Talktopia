package com.example.talktopia_chat.common.message;

import lombok.Getter;

@Getter
public class Message {

	private String message;

	public Message(String message) {
		this.message = message;
	}
}