package com.example.talktopia.api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.talktopia.api.response.TopicRes;
import com.example.talktopia.api.service.TopicService;
import com.example.talktopia.db.entity.topic.Topic;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/topic")
@RequiredArgsConstructor
public class TopicController {

	private final TopicService topicService;

	@GetMapping("/start/{sttLang}")
	public TopicRes startTopic(@PathVariable String sttLang){
		return topicService.startTopic(sttLang);
	}

}
