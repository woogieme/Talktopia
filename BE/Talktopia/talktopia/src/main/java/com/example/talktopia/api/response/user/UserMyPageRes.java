package com.example.talktopia.api.response.user;

import com.example.talktopia.db.entity.user.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
/** 마이페이지에 보여줄 유저 정보 리턴 */
public class UserMyPageRes {
	private String userId;
	private String userName;
	private String userPw;
	private String userEmail;
	private String userProfileImgUrl;
	private String userLan;

}
