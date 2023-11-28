package com.example.talktopia.api.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.talktopia.api.request.FCMFailMessage;
import com.example.talktopia.api.request.ReminderInviteReq;
import com.example.talktopia.api.response.ReminderBodyRes;
import com.example.talktopia.api.response.ReminderRes;
import com.example.talktopia.api.service.fcm.FcmService;
import com.example.talktopia.common.message.Message;
import com.example.talktopia.db.entity.user.Reminder;
import com.example.talktopia.db.entity.user.User;
import com.example.talktopia.db.repository.ReminderRepository;
import com.example.talktopia.db.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReminderService {

	private final ReminderRepository reminderRepository;

	private final UserRepository userRepository;

	private final FcmService fcmService;

	public ResponseEntity<List<ReminderRes>> showReminderList(String userId) throws Exception {
		// private long rmNo;
		// private String rmContent;
		// private String rmType;
		userRepository.findByUserId(userId).orElseThrow(() -> new Exception("유저를 못찾아"));

		List<Reminder> reminder = reminderRepository.findByUser_UserId(userId);
		if (reminder.isEmpty()) {
			return ResponseEntity.noContent().build();
		}
		List<ReminderRes> reminderResList = new ArrayList<>();
		for (Reminder rem : reminder) {
			ReminderRes reminderRes = ReminderRes.builder()
				.rmContent(rem.getRmContent())
				.rmNo(rem.getRmNo())
				.rmType(rem.getRmType())
				.rmRead(rem.isRmRead())
				.build();
			reminderResList.add(reminderRes);

		}
		Collections.reverse(reminderResList);
		return ResponseEntity.ok(reminderResList);
	}

	public ReminderBodyRes showNotice(long noticeId) throws Exception {

		Reminder reminder = reminderRepository.findById(noticeId).orElseThrow(() -> new Exception("존재하지 않는 알림"));
		reminder.setRmRead(true);
		ReminderBodyRes reminderBodyRes = ReminderBodyRes.builder()
			.rmNo(reminder.getRmNo())
			.rmHost(reminder.getRmHost())
			.rmVrSession(reminder.getRmVrSession())
			.rmContent(reminder.getRmContent())
			.rmRead(reminder.isRmRead())
			.rmType(reminder.getRmType())
			.rmGuest(reminder.getRmGuest())
			.receiverNo(reminder.getUser().getUserNo())
			.build();
		reminderRepository.save(reminder);
		return reminderBodyRes;
	}

	public String readRem(long rmNo) {
		Reminder reminder = reminderRepository.findByRmNo(rmNo);

		if(reminder == null) {
			throw new RuntimeException("해당 알림이 없습니다.");
		}

		reminder.setRmRead(true);
		reminderRepository.save(reminder);

		return reminder.getUser().getUserId();
	}

	public void accessRemind(ReminderInviteReq reminderInviteReq) throws Exception {
		//친구 요청일때
		if(reminderInviteReq.getRmType().equals("Friend Request")) {
			//해당하는것에대한 알림을 모두다 알림 처리해야한다.
			List<Reminder> reminders = reminderRepository.findByUser_UserNoAndRmHostAndRmType(
				reminderInviteReq.getReceiverNo(), reminderInviteReq.getRmHost(), reminderInviteReq.getRmType());
			for (Reminder reminder : reminders) {
				reminder.setRmContent("Alreay We are Friend.");
				reminder.setRmType("Done.");
				reminderRepository.save(reminder);
			}

			User oppsiteUser =userRepository.findByUserId(reminderInviteReq.getRmHost()).orElseThrow(()->new Exception("유저가 없어"));
			User opppsiteHost =userRepository.findByUserNo(reminderInviteReq.getReceiverNo());
			reminders = reminderRepository.findByUser_UserNoAndRmHostAndRmType(
				oppsiteUser.getUserNo(), opppsiteHost.getUserId(), reminderInviteReq.getRmType());
			for (Reminder reminder : reminders) {
				reminder.setRmContent("Alreay We are Friend.");
				reminder.setRmType("Done.");
				reminderRepository.save(reminder);
			}
		}
		//채팅방 요청일때
		else if(reminderInviteReq.getRmType().equals("Room Request")) {

			List<Reminder> reminders = reminderRepository.findByUser_UserNoAndRmHostAndRmTypeAndRmVrSession(reminderInviteReq.getReceiverNo(),reminderInviteReq.getRmHost(),reminderInviteReq.getRmType(),reminderInviteReq.getRmVrSession());
			for(Reminder reminder : reminders){
				reminder.setRmContent("Already We are Done.");
				reminder.setRmType("Done.");
				reminderRepository.save(reminder);
			}
			User oppsiteUser =userRepository.findByUserId(reminderInviteReq.getRmHost()).orElseThrow(()->new Exception("유저가 없어"));
			User opppsiteHost =userRepository.findByUserNo(reminderInviteReq.getReceiverNo());
			reminders = reminderRepository.findByUser_UserNoAndRmHostAndRmTypeAndRmVrSession(
				oppsiteUser.getUserNo(), opppsiteHost.getUserId(), reminderInviteReq.getRmType(),reminderInviteReq.getRmVrSession());
			for (Reminder reminder : reminders) {
				reminder.setRmContent("Alreay We are Friend.");
				reminder.setRmType("Done.");
				reminderRepository.save(reminder);
			}
		}
	}

	public Message 	denyRemind(ReminderInviteReq reminderInviteReq) throws Exception {
		//메세지를 보낸사람
		User oppsiteUserA =userRepository.findByUserId(reminderInviteReq.getRmHost()).orElseThrow(()->new Exception("유저가 없어"));
		//메세지를 받았던사람
		User opppsiteHostA =userRepository.findByUserNo(reminderInviteReq.getReceiverNo());

		FCMFailMessage fcmFailMessage = FCMFailMessage.builder()
			.senderId(opppsiteHostA.getUserId())
			.receiverId(oppsiteUserA.getUserId())
			.vRoomType(reminderInviteReq.getRmType())
			.build();


		if(reminderInviteReq.getRmType().equals("Friend Request")) {
			//해당하는것에대한 알림을 모두다 알림 처리해야한다.
			List<Reminder> reminders = reminderRepository.findByUser_UserNoAndRmHostAndRmType(
				reminderInviteReq.getReceiverNo(), reminderInviteReq.getRmHost(), reminderInviteReq.getRmType());
			for (Reminder reminder : reminders) {
				reminder.setRmContent("Denied Friend Request.");
				reminder.setRmType("Done.");
				reminderRepository.save(reminder);
			}

			User oppsiteUser =userRepository.findByUserId(reminderInviteReq.getRmHost()).orElseThrow(()->new Exception("유저가 없어"));
			User opppsiteHost =userRepository.findByUserNo(reminderInviteReq.getReceiverNo());
			reminders = reminderRepository.findByUser_UserNoAndRmHostAndRmType(
				oppsiteUser.getUserNo(), opppsiteHost.getUserId(), reminderInviteReq.getRmType());
			for (Reminder reminder : reminders) {
				reminder.setRmContent("Denied Friend Response.");
				reminder.setRmType("Done.");
				reminderRepository.save(reminder);
			}
		}
		//채팅방 요청일때
		else if(reminderInviteReq.getRmType().equals("Room Request")) {

			List<Reminder> reminders = reminderRepository.findByUser_UserNoAndRmHostAndRmTypeAndRmVrSession(reminderInviteReq.getReceiverNo(),reminderInviteReq.getRmHost(),reminderInviteReq.getRmType(),reminderInviteReq.getRmVrSession());
			for(Reminder reminder : reminders){
				reminder.setRmContent("Denied Room Request.");
				reminder.setRmType("Done.");
				reminderRepository.save(reminder);
			}
			User oppsiteUser =userRepository.findByUserId(reminderInviteReq.getRmHost()).orElseThrow(()->new Exception("유저가 없어"));
			User opppsiteHost =userRepository.findByUserNo(reminderInviteReq.getReceiverNo());
			reminders = reminderRepository.findByUser_UserNoAndRmHostAndRmTypeAndRmVrSession(
				oppsiteUser.getUserNo(), opppsiteHost.getUserId(), reminderInviteReq.getRmType(),reminderInviteReq.getRmVrSession());
			for (Reminder reminder : reminders) {
				reminder.setRmContent("Denied Room Response.");
				reminder.setRmType("Done.");
				reminderRepository.save(reminder);
			}
		}

		return fcmService.failFCMMessage(fcmFailMessage);
	}
}
