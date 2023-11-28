package com.example.talktopia.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.talktopia.api.request.user.UserInfoReq;
import com.example.talktopia.api.service.user.UserMailService;
import com.example.talktopia.api.service.user.UserService;
import com.example.talktopia.common.message.Message;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/join")
@Slf4j
@CrossOrigin(origins = "*", methods = {RequestMethod.POST, RequestMethod.GET,
	RequestMethod.OPTIONS})
public class JoinController {
	private final UserService userService;
	private final UserMailService userMailService;

	// Get =================================================================================================
	// 아이디 중복체크
	@GetMapping("/existId/{userId}")
	public ResponseEntity<Message> isExistUser(@PathVariable("userId") String userId) {
		userService.isExistUser(userId);
		return ResponseEntity.ok().body(new Message("중복 아이디가 없습니다."));
	}

	// Post =================================================================================================
	// 회원가입
	@PostMapping()
	public ResponseEntity<Message> joinUser(@RequestBody UserInfoReq userInfoReq) {
		return ResponseEntity.ok().body(userService.joinUser(userInfoReq));
	}

	// 이메일 인증
	@GetMapping("/checkEmail/{userEmail}")
	public ResponseEntity<Message> checkEmail(
		@PathVariable("userEmail") String userEmail) throws
		Exception {
		String code = userMailService.sendSimpleMessage(userEmail, "회원가입");
		return ResponseEntity.ok().body(new Message(code));
	}
}
