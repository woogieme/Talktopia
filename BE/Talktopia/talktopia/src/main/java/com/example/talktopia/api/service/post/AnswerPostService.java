package com.example.talktopia.api.service.post;

import org.springframework.stereotype.Service;

import com.example.talktopia.api.request.post.AnswerPostReq;
import com.example.talktopia.common.message.Message;
import com.example.talktopia.db.entity.post.AnswerPost;
import com.example.talktopia.db.entity.post.Post;
import com.example.talktopia.db.entity.user.User;
import com.example.talktopia.db.entity.user.UserRole;
import com.example.talktopia.db.repository.AnswerPostRepository;
import com.example.talktopia.db.repository.PostRepository;
import com.example.talktopia.db.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class AnswerPostService {

	private final AnswerPostRepository answerPostRepository;

	private final PostRepository postRepository;

	private final UserRepository userRepository;


	public Message answerPost(AnswerPostReq answerPostReq) throws Exception {
		Post post = postRepository.findByPostNo(answerPostReq.getPostNo()).orElseThrow(() -> new Exception("게시글이 없어요"));
		User user = userRepository.findByUserId(answerPostReq.getUserId()).orElseThrow(() -> new Exception("유저가 없어요"));
		if(user.getUserRole().equals(UserRole.ADMIN)) {
			AnswerPost answerPost = answerPostReq.toEntity(post);
			answerPostRepository.save(answerPost);
			return new Message("댓글을 달았습니다");
		}
		throw new Exception("댓글 다는 권한은 관리자에게만 있습니다.");
	}
}
