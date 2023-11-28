package com.example.talktopia.db.entity.topic;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name="topic")
public class Topic {


	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="topic_no")
	private long topicNo;

	@Column(name = "topic_id")
	private Long topicId;

	@Column(name = "topic_lang")
	private String topicLang;

	@Column(name = "topic_content")
	private String topicConent;

	@Column(name = "topic_title")
	private String topicTitle;

	@Builder
	public Topic(long topicId, String topicConent, String topicLang, String topicTitle) {
		this.topicId = topicId;
		this.topicConent = topicConent;
		this.topicLang = topicLang;
		this.topicTitle = topicTitle;
	}
}
