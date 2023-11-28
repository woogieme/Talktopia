package com.example.talktopia_chat.common.exception;

public class InValidNotFoundException extends ExceptionSample {

	public InValidNotFoundException(String value) {
		super(value, ErrorCode.INVALID_INPUT_VALUE);
	}

	public InValidNotFoundException(String value, ErrorCode errorCode) {
		super(value,errorCode);
	}
}