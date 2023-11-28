package com.example.talktopia.db.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.talktopia.db.entity.post.Post;

@Repository
public interface PostRepository extends JpaRepository<Post,Long> {

	@Query("SELECT p FROM Post p WHERE p.user.userNo = :userNo AND p.postType != 'NONACTIVE'")
	List<Post> findByUser_UserNo(long userNo);

	Optional<Post> findByPostNo(long postNo);

	Post findByUser_UserNoAndPostNo(long userNo, long postNo);

	boolean existsByUser_UserId(long userNo);

	boolean existsByUser_UserNo(long userNo);
}
