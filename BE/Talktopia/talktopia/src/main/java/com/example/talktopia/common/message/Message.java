package com.example.talktopia.common.message;

import lombok.Getter;

@Getter
public class Message {

	private String message;

	public Message(String message) {
		this.message = message;
	}
}