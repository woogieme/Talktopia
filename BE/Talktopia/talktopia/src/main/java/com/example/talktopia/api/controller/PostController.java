package com.example.talktopia.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.talktopia.api.request.post.RegistPostReq;
import com.example.talktopia.api.response.post.PostListRes;
import com.example.talktopia.api.response.post.PostRes;
import com.example.talktopia.api.service.post.PostService;
import com.example.talktopia.common.message.Message;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/ask")
@RequiredArgsConstructor
@Slf4j
public class PostController {

	private final PostService postService;


	@GetMapping("/enter")
	public ResponseEntity<?> enterPost(@RequestParam("userId")String userId) throws Exception {
		List<PostListRes> arr = postService.enterPost(userId);
		if (arr == null) {
			return ResponseEntity.badRequest().body("arr is null"); // 혹은 원하는 에러 메시지
		} else {
			return ResponseEntity.ok(arr);
		}
	}

	@PostMapping("/register")
	public Message registerPost(@RequestBody RegistPostReq registPostReq) throws Exception {
		return postService.registerPost(registPostReq);
	}

	@GetMapping("/list/delete")
	public Message deletePost(@RequestParam("userId")String userId,@RequestParam("postNo")long postNo) throws Exception {
		return postService.deletePost(userId,postNo);
	}

	@GetMapping("/list/detail")
	public PostRes detailPost(@RequestParam("userId")String userId,@RequestParam("postNo")long postNo) throws Exception {
		return postService.detailPost(userId,postNo);

	}

}
