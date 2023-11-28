package com.example.talktopia.api.request.user;

import com.example.talktopia.db.entity.user.Token;
import com.example.talktopia.db.entity.user.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserNewTokenReq {
	private String userId;
	private String refreshToken;

	public Token toEntity(User user) {
		return Token.builder()
			.tRefresh(refreshToken)
			.user(user)
			.build();
	}
}
