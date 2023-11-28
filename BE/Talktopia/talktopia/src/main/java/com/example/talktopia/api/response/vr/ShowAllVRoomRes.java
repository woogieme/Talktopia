package com.example.talktopia.api.response.vr;

import com.example.talktopia.common.util.RoomRole;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShowAllVRoomRes {

	String userId;
	RoomRole vRoomRole;

	@Builder
	public ShowAllVRoomRes(String userId, RoomRole vRoomRole) {
		this.userId = userId;
		this.vRoomRole = vRoomRole;
	}
}
