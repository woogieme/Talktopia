package com.example.talktopia.api.request.fcm;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FCMTokenReq {

	private String userId;
	private String token;

}
