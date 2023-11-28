package com.example.talktopia.api.request.post;

import java.time.LocalDateTime;

import com.example.talktopia.db.entity.post.Post;
import com.example.talktopia.db.entity.post.PostType;
import com.example.talktopia.db.entity.user.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegistPostReq {

	private String postTitle;
	private String postContent;
	private String userId;


	public Post toEntity(User user, PostType postType){
		return Post.builder()
			.postType(postType)
			.postTitle(postTitle)
			.postCreateTime(LocalDateTime.now())
			.postContent(this.postContent)
			.user(user)
			.build();
	}

}
