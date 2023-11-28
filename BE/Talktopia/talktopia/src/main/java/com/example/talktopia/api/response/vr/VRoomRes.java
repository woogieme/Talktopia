package com.example.talktopia.api.response.vr;


import java.util.List;

import com.example.talktopia.common.util.RoomRole;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VRoomRes {
	private String vrSession;
	private String token;
	private RoomRole roomRole;
	private List<ShowAllVRoomRes> showAllVRoomRes;
}
