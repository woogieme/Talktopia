package com.example.talktopia.api.service.post;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.example.talktopia.api.request.post.RegistPostReq;
import com.example.talktopia.api.response.post.AnswerPostRes;
import com.example.talktopia.api.response.post.PostListRes;
import com.example.talktopia.api.response.post.PostRes;
import com.example.talktopia.common.message.Message;
import com.example.talktopia.db.entity.post.AnswerPost;
import com.example.talktopia.db.entity.post.Post;
import com.example.talktopia.db.entity.post.PostType;
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
public class PostService {

	private final PostRepository postRepository;

	private final UserRepository userRepository;

	private final AnswerPostRepository answerPostRepository;

	public Message registerPost(RegistPostReq registPostReq) throws Exception {
		User user = userRepository.findByUserId(registPostReq.getUserId()).orElseThrow(() -> new Exception("우자기 앖어"));
		if(registPostReq.getPostTitle()==null){
			throw new Exception("제목이 비었습니다");
		}
		else if(registPostReq.getPostContent()==null){
			throw new Exception("본문이 비었습니다.");
		}
		Post operation = registPostReq.toEntity(user,PostType.ACTIVE);
		if(!checkRegisterCount(user.getUserNo())){
			operation.setPostCount(1);
		}
		else{
			operation.setPostCount(operation.getPostCount()+1);
		}
		postRepository.save(operation);
		return new Message("게시글이 올라왔습니다");
	}

	private boolean checkRegisterCount(long userNo) {
		return postRepository.existsByUser_UserNo(userNo);
	}

	public PostRes detailPost(String userId, long postNo) throws Exception {
		User user = userRepository.findByUserId(userId).orElseThrow(() -> new Exception("우자기 앖어"));
		Post post;
		if(user.getUserRole().equals(UserRole.ADMIN)){
			post = postRepository.findByPostNo(postNo).orElseThrow(()->new Exception("게시글이없어"));
		}
		else {
			post = postRepository.findByUser_UserNoAndPostNo(user.getUserNo(), postNo);
		}
		List<AnswerPost> answerPosts = answerPostRepository.findByPostPostNo(post.getPostNo());
		List<AnswerPostRes> answerPostRes = showPostOne(answerPosts);
		return new PostRes(post.getPostNo(),post.getPostTitle(),post.getPostContent(),post.getPostCount(),post.getPostCreateTime(),answerPostRes);

	}

	private List<AnswerPostRes> showPostOne(List<AnswerPost> answerPosts) {

		List<AnswerPostRes> answerPostRes = new ArrayList<>();
		for(AnswerPost answerPost: answerPosts){
			AnswerPostRes answer = new AnswerPostRes();
			answer.setUserId(answer.getUserId());
			answer.setContentContent(answerPost.getContentContent());
			answer.setContentCreateTime(answerPost.getContentCreateTime());

			answerPostRes.add(answer);
		}
		return answerPostRes;
	}

	public List<PostListRes> enterPost(String userId) throws Exception {
		User user = userRepository.findByUserId(userId).orElseThrow(() -> new Exception("우자기 앖어"));
		List<PostListRes> postListResList;
		if(user.getUserRole().equals(UserRole.ADMIN)){
			postListResList = showAllUserList();
		}
		else {
			postListResList = showPostMulti(user.getUserNo());
		}
		return postListResList;
	}


	@Transactional
	public Message deletePost(String userId, long postNo) throws Exception {
		User user = userRepository.findByUserId(userId).orElseThrow(() -> new Exception("우자기 앖어"));
		Post post = postRepository.findByPostNo(postNo).orElseThrow(() -> new Exception("없는 게시글임"));

		if(post.getUser().getUserId().equals(user.getUserId())&& post.getPostType().equals(PostType.ACTIVE)){
			post.setPostType(PostType.NONACTIVE);
			post.setPostCount(post.getPostCount()-1);
			postRepository.save(post);
			return new Message("게시글을 지웠습니다");
		}
		else if(post.getPostType().equals(PostType.NONACTIVE)){
			throw new Exception("이미 지웠는데 왜 또 지워?");
		}
		else{
			throw new Exception("지울수있는 권한이 존재하지 않습니다");
		}
	}

	private List<PostListRes> showPostMulti(long userId) {
		List<Post> postList = postRepository.findByUser_UserNo(userId);
		List<PostListRes> postListResList = new ArrayList<>();
		log.info(postList.toString());
		for(Post post : postList){
			PostListRes postListRes = new PostListRes();
			postListRes.setPostTitle(post.getPostTitle());
			postListRes.setPostNo(post.getPostNo());
			postListResList.add(postListRes);
		}
		return postListResList;
	}

	private List<PostListRes> showAllUserList() {
		List<Post> postList = postRepository.findAll();
		List<PostListRes> postListResList = new ArrayList<>();
		for(Post post : postList){
			PostListRes postListRes = new PostListRes();
			postListRes.setPostTitle(post.getPostTitle());
			postListRes.setPostNo(post.getPostNo());
			postListResList.add(postListRes);
		}
		return postListResList;
	}
}
