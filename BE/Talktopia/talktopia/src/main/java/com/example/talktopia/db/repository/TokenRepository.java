package com.example.talktopia.db.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.talktopia.db.entity.user.Token;
@Repository
public interface TokenRepository extends JpaRepository<Token, String> {
	Optional<Token> findByUserUserNo(long userNo);

	@Modifying
	@Query("DELETE FROM Token t WHERE t.user.userNo = :userNo")
	void deleteTokenByUserUserNo(@Param("userNo") long userNo);
}
