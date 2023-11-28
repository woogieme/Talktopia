package com.example.talktopia.api.response;

import com.example.talktopia.common.util.RoomRole;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class ParticipantDTO {

	private String userId;
	private RoomRole roomRole;

	public ParticipantDTO(String userId, RoomRole roomRole) {
		this.userId=userId;
		this.roomRole=roomRole;
	}
}
