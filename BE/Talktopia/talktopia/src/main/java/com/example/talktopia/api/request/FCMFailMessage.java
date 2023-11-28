package com.example.talktopia.api.request;

import com.example.talktopia.common.util.VRoomType;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FCMFailMessage {

	String senderId;

	String receiverId;

	String vRoomType;

	@Builder
	public FCMFailMessage(String senderId, String receiverId, String vRoomType) {
		this.senderId = senderId;
		this.receiverId = receiverId;
		this.vRoomType= vRoomType;
	}
}
