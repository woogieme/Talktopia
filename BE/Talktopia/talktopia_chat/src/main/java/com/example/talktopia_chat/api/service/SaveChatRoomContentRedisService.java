package com.example.talktopia_chat.api.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.ListIterator;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.example.talktopia_chat.api.response.EnterChatResponse;
import com.example.talktopia_chat.common.util.ChatSetToListUtil;
import com.example.talktopia_chat.common.util.DateFormatPattern;
import com.example.talktopia_chat.db.entity.ChatRoom;
import com.example.talktopia_chat.db.entity.SaveChatRoomContent;
import com.example.talktopia_chat.db.entity.SaveChatRoomContentRedis;
import com.example.talktopia_chat.db.repository.ChatRoomRepository;
import com.example.talktopia_chat.db.repository.SaveChatRoomContentRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class SaveChatRoomContentRedisService {

	private final RedisTemplate<String, SaveChatRoomContentRedis> redisTemplate;
	private final SaveChatRoomContentRepository saveChatRoomContentRepository;
	private final ChatRoomRepository chatRoomRepository;

	/**
	 * ================ save chat =================
	 * */
	// Redis에 저장된 캐시정보 갱신. 캐시가 없을 경우엔 생성함.
	// value는 캐시 이름이고 key는 캐시할 키
	// @CachePut(value = "chats", key = "#saveChatRoomContentRedis.scrcSession", cacheManager = "rcm")
	public void saveChat(String sessionId, SaveChatRoomContentRedis scrc) {
		// 순서가 있는 Set으로 저장. sort기준은 timeToDoubleForSort
		redisTemplate.opsForZSet().add(sessionId, scrc, timeToDoubleForSort(scrc.getScrcSendTime()));
	}

	// sendTime을 double로 만들어 zSet 정렬에 씀
	public Double timeToDoubleForSort(String sendTime) {
		DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(DateFormatPattern.get());
		LocalDateTime localDateTime = LocalDateTime.parse(sendTime, dateTimeFormatter);
		return ((Long)localDateTime.atZone(ZoneId.systemDefault()) // LocalDateTime을 시스템의 기본 타임존으로 함
			.toInstant() // ZonedDateTime을 Instant로 바꿈
			.toEpochMilli()).doubleValue();
	}

	/**
	 * ================ get chat =================
	 * */
	// 채팅 메세지를 캐싱하여 동일한 쿼리를 redis에 계속 실행할 필요 없음
	// @Cacheable(value = "chats", key = "#scrcSession", cacheManager = "rcm")
	public EnterChatResponse getRedisChat(String sessionId) {

		// ZSet에서 scrcSession을 키값으로 하는 데이터 리스트 반환
		List<SaveChatRoomContentRedis> chatList = ChatSetToListUtil.convert(sessionId, redisTemplate);

		// Cache-Through 전략: cache 조회 후 데이터 없으면 RDBMS조사하여 최신 30개의 데이터 저장.
		if (chatList.isEmpty()) {
			cacheThrough(sessionId);
			chatList = ChatSetToListUtil.convert(sessionId, redisTemplate);
		}

		// scrcSession과 함께 반환
		return new EnterChatResponse(sessionId, chatList);
	}

	/**
	 * ========  mysql에 있는 최근 30개의 채팅로그 redis로 저장 ==============
	 * */
	public void cacheThrough(String sessionId) {

		// scrcSession으로 채팅방 no 찾음
		Optional<ChatRoom> chatRoom = chatRoomRepository.findByCrSession(sessionId);
		if (chatRoom.isEmpty()) {
			return;
		}
		// 시간 내림차순으로 최근 30개 데이터 추출
		List<SaveChatRoomContent> saveChatRoomContentList = saveChatRoomContentRepository.findTop30ByChatRoom_CrNo_OrderByScrcNoDesc(
			chatRoom.get().getCrNo());

		// jpa entity => redis entity => redis에 저장
		Collections.reverse(saveChatRoomContentList); // 최근순인 데이터 뒤집기 => 시간 오름차순으로 30개 데이터 추출
		for (SaveChatRoomContent scrc : saveChatRoomContentList) {
			SaveChatRoomContentRedis temp = SaveChatRoomContentRedis.builder()
				.scrcSenderId(scrc.getScrcSenderId())
				.scrcContent(scrc.getScrcContent())
				// LocalDate to String
				.scrcSendTime(scrc.getScrcSendTime().format(DateTimeFormatter.ofPattern(DateFormatPattern.get())))
				.scrcCached(true)
				.build();

			redisTemplate.opsForZSet().add(sessionId, temp, timeToDoubleForSort(temp.getScrcSendTime()));
		}
	}
}