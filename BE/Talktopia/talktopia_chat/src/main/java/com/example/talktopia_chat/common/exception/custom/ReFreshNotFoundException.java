package com.example.talktopia_chat.common.exception.custom;

import com.example.talktopia_chat.common.exception.ErrorCode;
import com.example.talktopia_chat.common.exception.InValidNotFoundException;

public class ReFreshNotFoundException extends InValidNotFoundException {

	public ReFreshNotFoundException(String name) {
		super(name, ErrorCode.REFRESH_TOKEN_NOT_FOUND);
	}
}
