package com.example.talktopia.db.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.talktopia.db.entity.post.AnswerPost;

@Repository
public interface AnswerPostRepository extends JpaRepository<AnswerPost, Long> {

	@Query("select p from AnswerPost p where p.post.postNo=:postNo")
	List<AnswerPost> findByPostPostNo(long postNo);
}
