package com.example.talktopia_chat.db.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.talktopia_chat.db.entity.SaveChatRoomContent;

import io.lettuce.core.dynamic.annotation.Param;

public interface SaveChatRoomContentRepository extends JpaRepository<SaveChatRoomContent, Long> {
	Optional<SaveChatRoomContent> findByScrcNo(long scrcNo);

	List<SaveChatRoomContent> findAll();

	List<SaveChatRoomContent> findByChatRoom_crNo(long crNo);
	List<SaveChatRoomContent> findTop30ByChatRoom_CrNo_OrderByScrcNoDesc(long crNo);

	// @Query("select *\n"
	// 	+ "from SaveChatRoomContent s \n"
	// 	+ "where s.scrcSendTime < :time and s.chatRoom.crNo = :crNo  \n"
	// 	+ "order by s.scrcSendTime desc \n"
	// 	+ "limit 30;")
	// List<SaveChatRoomContent> findByPagingCursor(@Param("time") LocalDateTime time, @Param("crNo") long crNo);

	/**
	 * 특정 시간 이전의 채팅 내용을 페이징 처리하여 반환해야 하기 때문에 Page<SaveChatRoomContent>를 반환
	 * */
	Page<SaveChatRoomContent> findByScrcSendTimeBeforeAndChatRoom_CrSession(LocalDateTime sendTime, String sessionId, Pageable pageable);


	/**
	 * 특정 세션의 채팅 내용 중 최근 30개 가져옴
	 * */
	Page<SaveChatRoomContent> findByChatRoom_CrSession(String sessionId, Pageable pageable);
}

