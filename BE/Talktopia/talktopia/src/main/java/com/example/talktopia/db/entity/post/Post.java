package com.example.talktopia.db.entity.post;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.springframework.data.annotation.CreatedDate;

import com.example.talktopia.db.entity.user.User;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "post")
public class Post {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "post_no")
	private long postNo;

	@Column(length = 500, name = "post_content")
	private String postContent;

	@Column(name = "post_title")
	private String postTitle;

	@Column(name = "post_count")
	private int postCount;

	@CreatedDate
	@Column(name = "post_create_time")
	private LocalDateTime postCreateTime;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_no")
	private User user;

	@OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
	private List<AnswerPost> answerPostList = new ArrayList<>();

	@Enumerated(EnumType.STRING)
	private PostType postType;
	@Builder
	public Post(long postNo, String postContent, String postTitle, LocalDateTime postCreateTime, User user, PostType postType,int postCount) {
		this.postNo = postNo;
		this.postContent = postContent;
		this.postTitle = postTitle;
		this.postCreateTime = postCreateTime;
		this.postType=postType;
		this.postCount=postCount;
		setUser(user);
	}

	private void setUser(User user) {
		this.user = user;
		if (user != null) {
			user.getPostList().add(this);
		}
	}
}
