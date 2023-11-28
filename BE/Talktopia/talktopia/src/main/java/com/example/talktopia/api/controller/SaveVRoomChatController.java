package com.example.talktopia.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.talktopia.api.request.vr.ChatLogsRequest;
import com.example.talktopia.api.request.vr.SaveChatLog;
import com.example.talktopia.api.service.vr.SaveVRoomChatService;
import com.example.talktopia.common.message.Message;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/saveChatLog")
@RequiredArgsConstructor
@Slf4j
public class SaveVRoomChatController {

	private final SaveVRoomChatService saveVRoomChatService;

	@PostMapping("/saveLog")
	public ResponseEntity<Message> saveLog(@RequestBody ChatLogsRequest chatLogsRequest) {

		return ResponseEntity.ok(saveVRoomChatService.saveLog(chatLogsRequest));
	}
}
