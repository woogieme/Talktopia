package com.example.talktopia.api.response;

import java.util.List;

import com.example.talktopia.db.entity.topic.Topic;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TopicRes {

	String title;
	List<Topic> topicList;

}
