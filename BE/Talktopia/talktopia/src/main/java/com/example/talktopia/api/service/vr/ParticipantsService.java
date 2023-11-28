package com.example.talktopia.api.service.vr;

import org.springframework.stereotype.Service;

import com.example.talktopia.common.util.RoomRole;
import com.example.talktopia.db.entity.user.User;
import com.example.talktopia.db.entity.vr.Participants;
import com.example.talktopia.db.entity.vr.VRoom;
import com.example.talktopia.db.repository.ParticipantsRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class ParticipantsService {

	private final ParticipantsRepository participantsRepository;

	public void joinRoom(User user, VRoom vRoom, RoomRole host) {
		Participants participants = Participants.builder()
			.user(user)
			.vRoom(vRoom)
			.roomRole(host)
			.build();

		participantsRepository.save(participants);

	}

}
