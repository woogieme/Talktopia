package com.example.talktopia.api.request.vr;

import com.example.talktopia.common.util.RoomRole;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VRoomExitReq {

	String userId;
	String token;
	String vrSession;
	RoomRole roomRole;
}
