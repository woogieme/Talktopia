package com.example.talktopia.api.controller;

import static com.example.talktopia.common.message.RoomExitStatus.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.mail.Part;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import com.example.talktopia.api.request.vr.VRoomExitReq;
import com.example.talktopia.api.response.ParticipantDTO;
import com.example.talktopia.api.service.vr.VRoomService;
import com.example.talktopia.common.exception.ExceptionSample;
import com.example.talktopia.common.message.RoomExitStatus;
import com.example.talktopia.common.util.RoomRole;
import com.example.talktopia.db.entity.user.User;
import com.example.talktopia.db.entity.vr.Participants;

import com.example.talktopia.db.repository.ParticipantsRepository;
import com.example.talktopia.db.repository.UserRepository;
import com.example.talktopia.db.repository.VRoomRepository;

import io.openvidu.java.client.Session;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class WebSocketHandler {

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	private final VRoomService vRoomService;

	private final ParticipantsRepository participantsRepository;

	private final UserRepository userRepository;

	@Autowired
	public WebSocketHandler(VRoomService vRoomService,ParticipantsRepository participantsRepository,UserRepository userRepository) {
		this.vRoomService = vRoomService;
		this.participantsRepository =participantsRepository;
		this.userRepository=userRepository;
	}

	@MessageMapping("/api/v1/room/exit/{vrSession}")
	public void exitRoom(@Payload VRoomExitReq vRoomExitReq,
		@DestinationVariable("vrSession") String vrSession) throws Exception {
		log.info(vRoomExitReq.getVrSession());
		log.info(vRoomExitReq.getToken());
		log.info(vRoomExitReq.getUserId());
		User user = userRepository.findByUserId(vRoomExitReq.getUserId()).orElseThrow(() -> new Exception("우거가 없음 ㅋㅋ"));
		log.info(user.getUserId());
		RoomExitStatus roomExitStatus = vRoomService.exitRoom(vRoomExitReq);

		//방이 존재하는데 한명만 나간상태
		if(roomExitStatus.equals(EXIT_SUCCESS)) {
			//이거는 방장일때 권한을 넘겨줘야해
			if (isHost(vRoomExitReq.getUserId(),vRoomExitReq)) {
				Participants participants = chooseNewHost(vrSession);
				ParticipantDTO participantDTOs = new ParticipantDTO(participants.getUser().getUserId(),participants.getRoomRole());
				messagingTemplate.convertAndSend("/topic/room/" + vrSession, participantDTOs);
			}
			else{
				messagingTemplate.convertAndSend("/topic/room/" + vrSession, vRoomExitReq.getUserId()+"님이 나가셨습니다");
			}
		}
		else if(roomExitStatus.equals(ROOM_SEARCH_ERROR)){
			log.info("무슨 문제지?");
		}
	}

	private Participants chooseNewHost(String vrSession) throws Exception {
		List<Participants> participantsOptional = participantsRepository.findByVRoom_VrSession(vrSession);
		if (participantsOptional.isEmpty()) {
			throw new Exception("방이 터졌습니다");
		}
		Participants participant = participantsOptional.get(0);
		participant.setRoomRole(RoomRole.HOST);
		participantsRepository.save(participant);
		return participant;
	}

	private boolean isHost(String userId,VRoomExitReq vRoomExitReq) throws Exception {
		userRepository.findByUserId(userId).orElseThrow(() -> new ExceptionSample("유저가 없엉 ㅋ"));
		if(vRoomExitReq.getRoomRole().equals(RoomRole.HOST)){
			return true;
		}
		return false;
	}

}
//////////////////////////////////////////////////////////////////.
//방이 찾아지지않을때
// if(roomExitStatus.equals(NO_ONE_IN_ROOM)){
// 	messagingTemplate.convertAndSend("/topic/room/" +vrSession, "You Left the room");
// }
//방이 Host가 바뀔때

// messagingTemplate.convertAndSendToUser(newHostUserId, "/queue/role-change/" + vrSession,
// 	"You are now the host");

// messagingTemplate.convertAndSendToUser(vRoomExitReq.getUserId(), "/queue/exit-message/" + vrSession,
// 	"You have left the room");

// 방에 있는 모든 인원에게 메시지 전송
//////////////////////////////////////////////////////////////////.



//////////////////////////////////////////////////////////////////.
// List<Participants> participants = participantsRepository.findByVRoom_VrSession(vrSession);

// long userId = userRepository.findByUserId(newHostUserId).orElseThrow(() -> new Exception("유저가 없습니다"))
// 	.getUserNo();
// // long userId = user.getUserNo();
// for (Participants parti : participants) {
// 	user = userRepository.findByUserNo(parti.getUser().getUserNo());
// 	if (user.getUserNo() == userId) {
// 		roomRoleHashMap.put(user.getUserId(), RoomRole.HOST);
// 	} else {
// 		roomRoleHashMap.put(user.getUserId(), RoomRole.GUEST);
// 	}
// }
//////////////////////////////////////////////////////////////////.

////////////////////////////////////////////////////////////////
// log.info("바뀌어"+participantsOptional.get(0).getUser().getUserId());
// log.info("바뀌어"+participantsOptional.get(0).toString());
// log.info("바뀌어"+participantsOptional.get(0).getRoomRole().toString());
// // participantsList를 활용하여 원하는 작업 수행
// participantsOptional.get(0).setRoomRole(RoomRole.HOST);
// log.info("바뀜!!!"+participantsOptional.get(0).getRoomRole().toString());
// participantsRepository.save(participantsOptional.get(0));
////////////////////////////////////////////////////////////////