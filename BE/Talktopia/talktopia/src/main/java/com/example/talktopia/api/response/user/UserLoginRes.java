package com.example.talktopia.api.response.user;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginRes {
	private String userId;
	private String userName;
	private String accessToken;
	private String refreshToken;
	private Date expiredDate;
	private String sttLang;
	private String transLang;
	private String msg;
	private String profileUrl;
	private String role;
}

