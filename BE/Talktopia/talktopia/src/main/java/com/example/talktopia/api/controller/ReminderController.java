package com.example.talktopia.api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.talktopia.api.request.ReminderInviteReq;
import com.example.talktopia.api.response.ReminderBodyRes;
import com.example.talktopia.api.response.ReminderRes;
import com.example.talktopia.api.service.ReminderService;
import com.example.talktopia.common.message.Message;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("/api/v1/notice")
@RequiredArgsConstructor
public class ReminderController {

	private final ReminderService reminderService;

	@GetMapping("/list/{userId}")
	public ResponseEntity<List<ReminderRes>> showReminderList(@PathVariable("userId")String userId) throws Exception {

		return reminderService.showReminderList(userId);

	}

	@GetMapping("/{rmNo}")
	public ReminderBodyRes showNotice(@PathVariable("rmNo")long rmNo) throws Exception {

		return reminderService.showNotice(rmNo);

	}

	@PostMapping("/read/access")
	public ResponseEntity<Void> accessRemind(@RequestBody ReminderInviteReq reminderInviteReq) {
		try {
			reminderService.accessRemind(reminderInviteReq);
			return ResponseEntity.ok().build(); // 200 OK
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500 Internal Server Error
		}
	}

	@PostMapping("/read/deny")
	public ResponseEntity<Message> denyRemind(@RequestBody ReminderInviteReq reminderInviteReq) {
		try {
			Message result = reminderService.denyRemind(reminderInviteReq);
			return ResponseEntity.ok(result); // 200 OK
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500 Internal Server Error
		}
	}


	//안쓰는 메서드
	@PutMapping("/read/{rmNo}")
	public ResponseEntity<List<ReminderRes>> readRemind(@PathVariable("rmNo") long rmNo) throws Exception {
		String userId = reminderService.readRem(rmNo);
		return reminderService.showReminderList(userId);
	}
}
