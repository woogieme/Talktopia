package com.example.talktopia.api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.talktopia.api.request.ReportReq;
import com.example.talktopia.api.response.vr.SaveVRoomChatLogRes;
import com.example.talktopia.api.service.ManageService;
import com.example.talktopia.api.service.vr.SaveVRoomChatService;
import com.example.talktopia.common.message.Message;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/manage")
@RequiredArgsConstructor
public class ManageController {

	private final ManageService manageService;
	private final SaveVRoomChatService saveVRoomChatService;

	@PostMapping("/report")
	public Message reportUser(@RequestBody ReportReq reportReq) throws Exception {
		return manageService.reportUser(reportReq);
	}

	@GetMapping("/logList")
	public List<SaveVRoomChatLogRes> getLogList() {
		return saveVRoomChatService.chatLogList();
	}

}
