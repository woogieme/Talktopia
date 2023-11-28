package com.example.talktopia.db.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.talktopia.db.entity.topic.Topic;

@Repository
public interface TopicRepository extends JpaRepository<Topic,Long> {

	List<Topic> findByTopicLang(String topicLang);
}
