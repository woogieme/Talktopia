package com.example.talktopia.db.entity.post;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.springframework.data.annotation.CreatedDate;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "answer_post")
public class AnswerPost {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "content_no")
	private long contentNo;

	@Column(length = 500, name = "conent_content")
	private String contentContent;

	@CreatedDate
	@Column(name = "content_create_time")
	private LocalDateTime contentCreateTime;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "post_no")
	private Post post;

	@Builder
	public AnswerPost(long contentNo, String contentContent, LocalDateTime contentCreateTime, Post post) {
		this.contentNo = contentNo;
		this.contentContent = contentContent;
		this.contentCreateTime = contentCreateTime;
		setAnswerPost(post);
	}

	private void setAnswerPost(Post post) {
		this.post = post;
		post.getAnswerPostList().add(this);
	}

}
