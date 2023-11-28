package com.example.talktopia_chat.api.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.talktopia_chat.api.request.ChatRoomContentRequest;
import com.example.talktopia_chat.api.response.PagedChat;
import com.example.talktopia_chat.api.response.PagingChatResponse;
import com.example.talktopia_chat.common.util.DateFormatPattern;
import com.example.talktopia_chat.common.util.RandomNumberUtil;
import com.example.talktopia_chat.db.entity.ChatRoom;
import com.example.talktopia_chat.db.entity.ChatRoomParticipants;
import com.example.talktopia_chat.db.entity.SaveChatRoomContent;
import com.example.talktopia_chat.db.repository.ChatRoomParticipantsRepository;
import com.example.talktopia_chat.db.repository.ChatRoomRepository;
import com.example.talktopia_chat.db.repository.SaveChatRoomContentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor  // 의존성 주입
public class ChatService {

	private final ChatRoomRepository chatRoomRepository;
	private final SaveChatRoomContentRepository saveChatRoomContentRepository;
	private final ChatRoomParticipantsRepository chatRoomParticipantsRepository;

	// 1. 아이디로 채팅방 조회
	// 2. 채팅한 적 있으면 세션아이디 반환
	// 3. 채팅한 적 없으면 세션 생성 후 반환
	public String enterChat(String userId, String friendId) {
		System.out.println("user, friend: " + userId + ", " + friendId);

		// 내가 participant일때 채팅방 찾아 세션 반환
		String res = findParticipantsSession(userId, friendId);
		log.info("내가 주인으로 참여한 채팅방은: " + res);
		// if (!res.equals(""))
		if (res != null)
			return res;

		// 내가 participant_other일 수도 있음
		String res2 = findParticipantsSession(friendId, userId);
		log.info("내가 other로 참여한 채팅방은: " + res2);
		// if (!res2.equals(""))
		if (res2 != null)
			return res2;

		// 채팅한 적이 없음
		// 세션 생성 후 입장. participant:나, participant other: 친구
		String newSession = makeChatRoom(userId, friendId);
		log.info("새로운 채팅방 세션은: " + newSession);
		return newSession;
		// return makeChatRoom(userId, friendId);
	}

	// 사용자 아이디로 채팅방 조회
	public String findParticipantsSession(String id1, String id2) {
		// 내가 participant일때 채팅방 찾음
		Optional<ChatRoomParticipants> areThereParticipants = chatRoomParticipantsRepository.findByCrpParticipantAndAndCrpParticipantOther(
			id1,
			id2);

		if (areThereParticipants.isPresent()) {
			return areThereParticipants.get().getChatRoom().getCrSession();
		} else {
			return null;
		}
	}

	// 세션 만들기
	// 1. ChatRoom 만들기
	// 2, ChatRoom에 새로운 세션 넣기
	// 3. ChatRoomParticipant만들기
	// 4. ChatRoomParticipant가 ChatRoom참조하도록 하기
	public String makeChatRoom(String userId, String friendId) {

		// 고유한 세션아이디가 있는 채팅방 생성
		String sessionId = RandomNumberUtil.getRandomNumber();
		ChatRoom newChatRoom = ChatRoom.builder()
			.crSession(sessionId)
			.build();
		newChatRoom = chatRoomRepository.save(newChatRoom);

		// newChatRoom을 참조하는 새로운 chatRoomParticipant생성
		ChatRoomParticipants newChatRoomParticipants = ChatRoomParticipants
			.builder()
			.chatRoom(newChatRoom)
			.crpParticipant(userId)
			.crpParticipantOther(friendId)
			.build();
		newChatRoomParticipants = chatRoomParticipantsRepository.save(newChatRoomParticipants);
		log.info("새로운 참여자정보: " + newChatRoomParticipants.toString());

		// 세션아이디 반환
		return sessionId;
	}

	/**
	 * MySQL에 있는 데이터 커서 기반 페이징해서 가져오기
	 * */
	public PagingChatResponse getPagingChat(String sessionId, String sendTime) {

		// 커서 값 (sendTime) 기반으로 정렬 조건 생성
		Sort sort = Sort.by(Sort.Direction.DESC, "scrcSendTime");

		// 페이지 크기 설정
		int pageSize = 30;

		// Pageable 객체 생성
		Pageable pageable;

		// 클라이언트로부터 커서 (sendTime)받음
		LocalDateTime realSendTime = LocalDateTime.parse(sendTime,
			DateTimeFormatter.ofPattern(DateFormatPattern.get()));
		pageable = PageRequest.of(0, pageSize, sort);

		// MySQL에서 커서 값 이전의 데이터 가져오기(pageable이 sort하고 개수 지정함)
		Page<SaveChatRoomContent> pageResult = saveChatRoomContentRepository.findByScrcSendTimeBeforeAndChatRoom_CrSession(
			realSendTime, sessionId, pageable);

		// 가져온 데이터로 리스트생성 => 뒤집기
		// ==> 시간으로 내림차순정렬 후 특정시간 이전의 값을 가져왔기때문에 데이터가 최신순으로 나옴. 따라서 뒤집어야함
		List<SaveChatRoomContent> chatList = pageResult.getContent();
		if (chatList == null || chatList.size() == 0)
			return new PagingChatResponse(null, false);

		log.info("스크롤 pageReuslt.getContent: " + chatList);
		log.info(chatList.get(0).toString());
		log.info(chatList.get(chatList.size() - 1).toString());

		List<PagedChat> res = new ArrayList<>();
		for (SaveChatRoomContent chat : chatList) {
			res.add(PagedChat.builder()
				.scrcSenderId(chat.getScrcSenderId())
				.scrcContent(chat.getScrcContent())
				// LocalDate to String
				.scrcSendTime(chat.getScrcSendTime().format(DateTimeFormatter.ofPattern(DateFormatPattern.get())))
				.build());
		}

		Collections.reverse(res);
		Boolean hasNext = pageResult.hasNext();

		return new PagingChatResponse(res, hasNext);
	}

	// private List<Board> getChats(String sessionId, String sendTime, Pageable page) {
	// 	return id == null ?
	// 		this.boardRepository.findAllByOrderByIdDesc(page) :
	// 		this.boardRepository.findByIdLessThanOrderByIdDesc(id, page);
	// }
	//
	// private Boolean hasNext(Long id) {
	// 	if (id == null) return false;
	// 	return saveChatRoomContentRepository.existsByIdLessThan(id);
	// }
}
