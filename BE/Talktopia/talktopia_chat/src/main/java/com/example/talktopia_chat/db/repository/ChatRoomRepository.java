package com.example.talktopia_chat.db.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.talktopia_chat.db.entity.ChatRoom;
import com.example.talktopia_chat.db.entity.ChatRoomParticipants;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
	Optional<ChatRoom> findByCrNo(long crNo);

	// 세션아이디로 조회
	Optional<ChatRoom> findByCrSession(String crSession);

	List<ChatRoom> findAll();

	// 외부채팅방 삭제
	Optional<ChatRoom> deleteByCrNo(long crNo);


}
