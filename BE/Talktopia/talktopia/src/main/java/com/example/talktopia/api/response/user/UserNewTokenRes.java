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
public class UserNewTokenRes {
	private String userId;
	private String accessToken;
	private String refreshToken;
	private Date expiredDate;
}
