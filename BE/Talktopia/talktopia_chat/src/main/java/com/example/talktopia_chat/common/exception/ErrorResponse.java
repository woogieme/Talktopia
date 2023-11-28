package com.example.talktopia_chat.common.exception;

import java.util.ArrayList;
import java.util.List;

import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ErrorResponse {

	private String message;
	private String code;
	private String status;
	private ErrorResponse(final ErrorCode code) {
		this.message = code.getMessage();
		this.code = code.getCode();
		this.status = String.valueOf(code.getStatus());
	}

	public static ErrorResponse of(final ErrorCode code) {
		return new ErrorResponse(code);
	}

}