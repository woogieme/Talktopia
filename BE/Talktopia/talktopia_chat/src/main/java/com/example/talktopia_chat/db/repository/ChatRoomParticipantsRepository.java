package com.example.talktopia_chat.db.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.talktopia_chat.db.entity.ChatRoomParticipants;

public interface ChatRoomParticipantsRepository extends JpaRepository<ChatRoomParticipants, Long> {
	Optional<ChatRoomParticipants> findByCrpNo(long crpNo);

	List<ChatRoomParticipants> findAll();

	// userId, friendId로 참여자정보 조회
	Optional<ChatRoomParticipants> findByCrpParticipantAndAndCrpParticipantOther(String crpParticipant,
		String crpParticipantOther);

}

