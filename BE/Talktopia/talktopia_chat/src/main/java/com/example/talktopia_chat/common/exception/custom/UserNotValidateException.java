package com.example.talktopia_chat.common.exception.custom;

import com.example.talktopia_chat.common.exception.ErrorCode;
import com.example.talktopia_chat.common.exception.EntityNotFoundException;

public class UserNotValidateException extends EntityNotFoundException {

	public UserNotValidateException(String name){
		super(name, ErrorCode.USER_NOT_VALIDATE);
	}
}
