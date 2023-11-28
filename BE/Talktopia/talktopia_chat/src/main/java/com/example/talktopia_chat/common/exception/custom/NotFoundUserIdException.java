package com.example.talktopia_chat.common.exception.custom;

import com.example.talktopia_chat.common.exception.EntityNotFoundException;
import com.example.talktopia_chat.common.exception.ErrorCode;

public class NotFoundUserIdException extends EntityNotFoundException {

	public NotFoundUserIdException(String message) {
		super(message,ErrorCode.LOGIN_DUPLICATION);
	}
}