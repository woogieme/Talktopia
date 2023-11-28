package com.example.talktopia.api.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.talktopia.api.request.FindUserReq;
import com.example.talktopia.api.request.friend.FriendIdPwReq;
import com.example.talktopia.api.request.friend.FriendReq;
import com.example.talktopia.api.request.friend.UnknownUserReq;
import com.example.talktopia.api.service.friend.FriendService;
import com.example.talktopia.common.message.Message;
import com.example.talktopia.db.repository.FriendRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/friend")
public class FriendController {

	private final FriendRepository friendRepository;
	private final FriendService friendService;
	// private final ChatService chatService;

	// 친구 추가
	@PostMapping("/add")
	public ResponseEntity<Message> addFriend(@RequestBody FriendIdPwReq friendIdPwReq) {
		return ResponseEntity.ok().body(friendService.addFriend(friendIdPwReq));
	}

	// 친구 삭제
	@PostMapping("/delete")
	public ResponseEntity<Message> deleteFriend(@RequestBody FriendIdPwReq friendIdPwReq) {
		return ResponseEntity.ok().body(friendService.deleteFriend(friendIdPwReq));
	}

	// 친구 목록 반환
	@GetMapping("/list/{userId}")
	public ResponseEntity<List<UnknownUserReq>> listFriend(@PathVariable("userId") String userId){
		log.info(userId);
		return ResponseEntity.ok().body(friendService.getFriends(userId));
	}

	//유저검색
	@PostMapping("/findUserId")
	public ResponseEntity<?> findUserId(@RequestBody FindUserReq findUserReq) throws Exception {
		List<UnknownUserReq> arr = friendService.findUserId(findUserReq);
		if (arr == null) {
			return ResponseEntity.badRequest().body("arr is null"); // 혹은 원하는 에러 메시지
		} else {
			return ResponseEntity.ok(arr);
		}
	}
}
