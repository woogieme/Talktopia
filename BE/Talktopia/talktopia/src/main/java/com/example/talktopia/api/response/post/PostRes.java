package com.example.talktopia.api.response.post;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostRes {
	long postNo;
	String postTitle;
	String postContent;
	int postCount;
	LocalDateTime postCreateTime;
	List<AnswerPostRes> answerPosts;
	@Builder
	public PostRes(long postNo, String postTitle, String postContent, int postCount,LocalDateTime postCreateTime ,List<AnswerPostRes> answerPosts) {
		this.postNo = postNo;
		this.postTitle = postTitle;
		this.postCount=postCount;
		this.postContent = postContent;
		this.postCreateTime =postCreateTime;
		this.answerPosts=answerPosts;
	}
}
