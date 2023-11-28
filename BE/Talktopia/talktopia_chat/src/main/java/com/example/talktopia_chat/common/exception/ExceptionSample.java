package com.example.talktopia_chat.common.exception;

import lombok.Getter;

@Getter
public class ExceptionSample extends  RuntimeException {

	private ErrorCode errorCode;

	public ExceptionSample(String message, ErrorCode errorCode) {
		super(message);
		this.errorCode = errorCode;
	}

	public ExceptionSample(ErrorCode errorCode) {
		super(errorCode.getMessage());
		this.errorCode = errorCode;
	}

	public ErrorCode getErrorCode() {
		return errorCode;
	}
}
