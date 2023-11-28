package com.example.talktopia.api.request.post;

import java.time.LocalDateTime;

import javax.persistence.SequenceGenerators;

import com.example.talktopia.db.entity.post.AnswerPost;
import com.example.talktopia.db.entity.post.Post;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnswerPostReq {

	String userId;
	long postNo;
	String contentContent;

	public AnswerPost toEntity(Post post){
		return AnswerPost.builder()
			.contentContent(contentContent)
			.contentCreateTime(LocalDateTime.now())
			.post(post)
			.build();
	}
}
