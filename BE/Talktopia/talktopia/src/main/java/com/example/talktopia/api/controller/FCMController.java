package com.example.talktopia.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.talktopia.api.request.FCMFailMessage;
import com.example.talktopia.api.request.fcm.FCMSendFriendMessage;
import com.example.talktopia.api.request.fcm.FCMSendVroomMessage;
import com.example.talktopia.api.request.fcm.FCMTokenReq;
import com.example.talktopia.api.service.fcm.FcmService;
import com.example.talktopia.common.message.Message;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/fcm")
@CrossOrigin(origins = "*", methods = {RequestMethod.POST, RequestMethod.GET,
	RequestMethod.OPTIONS})
public class FCMController {

	private final FcmService fcmService;

	@PostMapping("/saveFCM")
	public void saveToken(@RequestBody FCMTokenReq fcmTokenReq) throws Exception {
		fcmService.saveToken(fcmTokenReq);
	}

	@PostMapping("/sendVroomMessage")
	public Message sendVroomMessage(@RequestBody FCMSendVroomMessage fcmSendVroomMessage) throws Exception {
		return fcmService.sendVroomMessage(fcmSendVroomMessage);
	}

	@PostMapping("/sendFriendMessage")
	public ResponseEntity<Message> sendFriendMessage(@RequestBody FCMSendFriendMessage fcmSendFriendMessage) throws Exception {
		try {
			Message message = fcmService.sendFriendMessage(fcmSendFriendMessage);
			return ResponseEntity.ok(message);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(new Message(e.getMessage()));
		}
	}

	@PostMapping("/failFCMMessage")
	public Message failFCMMessage(@RequestBody FCMFailMessage fcmFailMessage) throws Exception {
		return fcmService.failFCMMessage(fcmFailMessage);

	}



}
