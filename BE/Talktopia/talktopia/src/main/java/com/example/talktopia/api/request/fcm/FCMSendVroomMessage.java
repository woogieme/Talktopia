package com.example.talktopia.api.request.fcm;

import java.util.List;

import lombok.Getter;

@Getter
public class FCMSendVroomMessage {

	List<String> friendId;

	String vrSession;

	String userId;

}
