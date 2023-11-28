package com.example.talktopia.api.request.user;

import com.example.talktopia.db.entity.user.Language;
import com.example.talktopia.db.entity.user.ProfileImg;
import com.example.talktopia.db.entity.user.ProviderType;
import com.example.talktopia.db.entity.user.User;
import com.example.talktopia.db.entity.user.UserRole;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoReq {

	private String userId;
	private String userPw;
	private String userName;
	private String userEmail;
	private String userLan;

	public User toEntity(Language language, ProfileImg profileImg) {
		return User.builder()
			.userId(userId)
			.userPw(userPw)
			.userName(userName)
			.userEmail(userEmail)
			.userRole(UserRole.USER)
			.profileImg(profileImg)
			.providerType(ProviderType.LOCAL)
			.language(language)
			.build();
	}
}
