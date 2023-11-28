package com.example.talktopia.common.exception;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum ErrorCode {

	// Common
	INVALID_INPUT_VALUE(400, "C001", "입력을 잘못하셨습니다"),
	METHOD_NOT_ALLOWED(405, "C002", " 입력을 잘못하셨습니다"),
	ENTITY_NOT_FOUND(404, "C003", "도메인에 없는 값입니다.(DB)"),
	INTERNAL_SERVER_ERROR(500, "C004", "범상치 않은 서버 오류입니다."),
	INVALID_TYPE_VALUE(400, "C005", " 타입이 잘못되었습니다,"),
	HANDLE_ACCESS_DENIED(403, "C006", "입장권한이 없습니다"),
	UNAUTHORIZED(401, "C007", "허가되지않은 계정입니다."),

	// User
	EMAIL_DUPLICATION(409, "U001", "이메일이 중복되었습니다."),
	//AUTH_EMAIL_SEND_FAIL(500, "U002", "Auth Email Send Fail"),
	NICKNAME_DUPLICATION(409, "U003", "닉네임이 중복되었습니다."),
	CURRENT_PASSWORD_NOT_MATCH_EXCEPTION(400, "U004", "현재 패스워드가 맞지 않습니다."),
	LOGIN_DUPLICATION(409, "U005", "현재 유저가 로그인중입니다. 로그인을할수없습니다.");


	private final String code;
	private final String message;
	private int status;

	ErrorCode(final int status, final String code, final String message) {
		this.status = status;
		this.message = message;
		this.code = code;
	}

	public String getMessage() {
		return this.message;
	}

	public String getCode() {
		return code;
	}

	public int getStatus() {
		return status;
	}

}
