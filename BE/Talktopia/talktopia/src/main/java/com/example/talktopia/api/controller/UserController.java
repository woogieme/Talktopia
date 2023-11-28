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

import com.example.talktopia.api.request.user.UserIdPwReq;
import com.example.talktopia.api.request.user.UserNewTokenReq;
import com.example.talktopia.api.request.user.UserSearchIdReq;
import com.example.talktopia.api.request.user.UserSearchPwReq;
import com.example.talktopia.api.response.user.UserNewTokenRes;
import com.example.talktopia.api.response.user.UserLoginRes;
import com.example.talktopia.api.response.user.UserSearchIdRes;
import com.example.talktopia.api.service.user.UserService;
import com.example.talktopia.common.message.Message;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
@Slf4j
@CrossOrigin(origins = "*", methods = {RequestMethod.POST, RequestMethod.GET,
	RequestMethod.OPTIONS})
public class UserController {

	private final UserService userService;

	// Get =================================================================================================
	// 로그아웃
	@GetMapping("/logout/{userId}")
	public ResponseEntity<Message> logoutUser(@PathVariable String userId) {
		return ResponseEntity.ok().body(userService.logout(userId));
	}

	// Post =================================================================================================
	// 로그인
	@PostMapping("/login")
	public ResponseEntity<UserLoginRes> loginUser(@RequestBody UserIdPwReq userIdPwReq) {
		UserLoginRes userLoginRes = userService.login(userIdPwReq);
		return ResponseEntity.ok().body(userLoginRes);
	}

	// 토큰 재발급
	@PostMapping("/reqNewToken")
	public ResponseEntity<UserNewTokenRes> createNewToken(@RequestBody UserNewTokenReq userNewTokenReq) {
		UserNewTokenRes userNewTokenRes = userService.reCreateNewToken(userNewTokenReq);
		return ResponseEntity.ok().body(userNewTokenRes);
	}

	// 아이디 찾기
	@PostMapping("/searchId")
	public ResponseEntity<UserSearchIdRes> searchUserId(@RequestBody UserSearchIdReq userSearchIdReq) {
		return ResponseEntity.ok().body(userService.searchId(userSearchIdReq));
	}

	// 비밀번호 찾기
	@PostMapping("/searchPw")
	public ResponseEntity<Message> searchUserPw(@RequestBody UserSearchPwReq userSearchPwReq) throws Exception {
		return ResponseEntity.ok().body(userService.searchPw(userSearchPwReq));
	}
}