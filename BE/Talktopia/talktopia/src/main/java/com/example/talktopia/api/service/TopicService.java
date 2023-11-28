package com.example.talktopia.api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.talktopia.api.response.TopicRes;
import com.example.talktopia.db.entity.topic.Topic;
import com.example.talktopia.db.repository.TopicRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class TopicService {

	private final TopicRepository topicRepository;

	public TopicRes startTopic(String sttLang) {
		List<Topic> topic = topicRepository.findByTopicLang(sttLang);
		String topicTitle = topic.get(0).getTopicTitle();

		return new TopicRes(topicTitle, topic);
	}
}
