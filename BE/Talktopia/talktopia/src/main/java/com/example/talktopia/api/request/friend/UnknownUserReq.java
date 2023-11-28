package com.example.talktopia.api.request.friend;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UnknownUserReq {

	String userId;
	String userStatus;
	String userName;
	String userImg;
	String userLng;
	String userLngImg;
	String userLangTrans;

	@Builder
	public UnknownUserReq(String userId, String userStatus, String userName, String userImg, String userLng,
		String userLngImg, String userLangTrans) {
		this.userId = userId;
		this.userStatus = userStatus;
		this.userName = userName;
		this.userImg = userImg;
		this.userLng = userLng;
		this.userLngImg = userLngImg;
		this.userLangTrans = userLangTrans;
	}
}
