package com.example.talktopia.api.request.user;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserImageRes {

	private String imageUrl;

	@Builder
	public UserImageRes(String imgUrl) {
		this.imageUrl=imgUrl;
	}
}
