package com.example.talktopia.api.request.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class UserSearchPwReq {

	private String userId;
	private String userName;
	private String userEmail;
}
