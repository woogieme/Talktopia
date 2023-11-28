package com.example.talktopia.api.request.friend;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FriendReq {

	String userId;
	String userStatus;
	String userName;
	String userImg;


	@Builder
	public FriendReq(String userId, String userStatus, String userName, String userImg) {
		this.userId = userId;
		this.userStatus = userStatus;
		this.userName = userName;
		this.userImg = userImg;
	}
}
