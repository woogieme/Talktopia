package com.example.talktopia_chat.common.exception;

public class EntityNotFoundException extends ExceptionSample {

	public EntityNotFoundException(String message) {
		super(message, ErrorCode.ENTITY_NOT_FOUND);
	}

	public EntityNotFoundException(String value, ErrorCode errorCode) {
		super(value, errorCode);
	}

}