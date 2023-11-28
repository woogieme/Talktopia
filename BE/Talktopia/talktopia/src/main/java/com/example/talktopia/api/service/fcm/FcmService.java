package com.example.talktopia.api.service.fcm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.talktopia.api.request.FCMFailMessage;
import com.example.talktopia.api.request.fcm.FCMSendFriendMessage;
import com.example.talktopia.api.request.fcm.FCMSendVroomMessage;
import com.example.talktopia.api.request.fcm.FCMTokenReq;
import com.example.talktopia.api.service.friend.FriendService;
import com.example.talktopia.api.service.user.UserStatusService;
import com.example.talktopia.common.message.Message;
import com.example.talktopia.db.entity.user.Reminder;
import com.example.talktopia.db.entity.user.Token;
import com.example.talktopia.db.entity.user.User;
import com.example.talktopia.db.entity.vr.VRoom;
import com.example.talktopia.db.repository.ReminderRepository;
import com.example.talktopia.db.repository.TokenRepository;
import com.example.talktopia.db.repository.UserRepository;
import com.example.talktopia.db.repository.VRoomRepository;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Notification;
import com.google.firebase.messaging.WebpushConfig;
import com.google.firebase.messaging.WebpushFcmOptions;
import com.google.firebase.messaging.WebpushNotification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class FcmService {

	private final FirebaseMessaging firebaseMessaging;

	private final TokenRepository tokenRepository;

	private final UserRepository userRepository;

	private final VRoomRepository vRoomRepository;

	private final ReminderRepository reminderRepository;

	private final UserStatusService userStatusService;

	private final FriendService friendService;
	public void saveToken(FCMTokenReq fcmTokenReq) throws Exception {
		log.info("fcmTokenReq: " + fcmTokenReq.getUserId());
		User user = userRepository.findByUserId(fcmTokenReq.getUserId()).orElseThrow(()-> new Exception("유저가 없어0"));

		Token token = tokenRepository.findByUserUserNo(user.getUserNo()).orElseThrow( () -> new Exception("DB에 없는데?"));

		token.setTFcm(fcmTokenReq.getToken());

		tokenRepository.save(token);

	}

	public Message sendVroomMessage(FCMSendVroomMessage fcmSendVroomMessage) throws Exception {

		int friendSize = fcmSendVroomMessage.getFriendId().size();
		List<String> notInviteList = new ArrayList<>();
		User hostUser =userRepository.findByUserId(fcmSendVroomMessage.getUserId()).orElseThrow(()->new Exception("호스트 유저가없어요"));
		if(friendSize>0) {
			for (int i = 0; i < friendSize; i++) {
				User user = userRepository.findByUserId(fcmSendVroomMessage.getFriendId().get(i))
					.orElseThrow(() -> new Exception("유저가없엉"));
				if(!userStatusService.getUserStatus(user.getUserId()).equals("ONLINE")){
					String body = fcmSendVroomMessage.getUserId()+" You invited, but the customer was on another business.";
					Reminder reminder = Reminder.builder()
						.rmContent(body)
						.rmType("Room Request")
						.user(user)
						.rmVrSession(fcmSendVroomMessage.getVrSession())
						.rmHost(hostUser.getUserId())
						.rmGuest(user.getUserId())
						.rmRead(false)
						.build();
					reminderRepository.save(reminder);
					notInviteList.add(user.getUserId());
				}
				else if (user.getToken().getTFcm() != null) {
					String title = "A video chat room invitation notification has been sent.";
					String body = fcmSendVroomMessage.getUserId()+" has invited you to the video chat room.";
					VRoom vRoom = vRoomRepository.findByVrSession(fcmSendVroomMessage.getVrSession());

					Reminder reminder = Reminder.builder()
						.rmContent(body)
						.rmType("Room Request")
						.user(user)
						.rmGuest(user.getUserId())
						.rmVrSession(fcmSendVroomMessage.getVrSession())
						.rmHost(hostUser.getUserId())
						.rmRead(false)
						.build();
					reminderRepository.save(reminder);


					Map<String, String> data = new HashMap<>();
					data.put("rmNo", String.valueOf(reminder.getRmNo()));

					Notification notification = Notification.builder()
						.setTitle(title)
						.setBody(body)
						.build();

					com.google.firebase.messaging.Message message = com.google.firebase.messaging.Message.builder()
						.setToken(user.getToken().getTFcm())
						.setNotification(notification)
						.putAllData(data)
						.build();

					firebaseMessaging.send(message);
				}
			}
			if(notInviteList.size()>0){
				User user = userRepository.findByUserId(fcmSendVroomMessage.getUserId()).orElseThrow(()->new Exception("노 유저"));
				StringBuilder body = new StringBuilder();
				for(String list : notInviteList){
					body.append(list).append("user ");
				}
				Notification notification = Notification.builder()
					.setTitle(" They are not online")
					.setBody(body.toString())
					.build();

				com.google.firebase.messaging.Message message = com.google.firebase.messaging.Message.builder()
					.setToken(user.getToken().getTFcm())
					.setNotification(notification)
					.build();
				firebaseMessaging.send(message);
			}
			return new Message("Notification sent successfully");
		}
		return new Message("I couldn't bring my friend");
	}

	public Message sendFriendMessage(FCMSendFriendMessage fcmSendFriendMessage) throws Exception {
		User hostUser =userRepository.findByUserId(fcmSendFriendMessage.getUserId()).orElseThrow(()->new Exception("호스트 유저가없어요"));
		User user = userRepository.findByUserId(fcmSendFriendMessage.getFriendId()).orElseThrow(()-> new Exception("친구 유저가없엉"));
		String title = "A friend request notification has been received.";
		String body = fcmSendFriendMessage.getUserId()+" has sent a friend request.";
		if (user.getToken() != null && user.getToken().getTFcm() !=null){
			User duplicateUser = userRepository.findByUserId(fcmSendFriendMessage.getUserId()).orElseThrow(()->new Exception("내 유저가 없어"));
			if(friendService.isAlreadyFriend(duplicateUser.getUserNo(),user.getUserNo())){
				throw new RuntimeException("We're already friends.");
			}

			Reminder reminder = Reminder.builder()
				.rmContent(body)
				.rmType("Friend Request")
				.user(user)
				.rmVrSession("NONE")
				.rmGuest(user.getUserId())
				.rmHost(hostUser.getUserId())
				.rmRead(false)
				.build();

			reminderRepository.save(reminder);

			Map<String, String> data = new HashMap<>();
			data.put("rmNo", String.valueOf(reminder.getRmNo()));

			Notification notification = Notification.builder()
				.setTitle(title)
				.setBody(body)
				.build();

			com.google.firebase.messaging.Message message = com.google.firebase.messaging.Message.builder()
				.setToken(user.getToken().getTFcm())
				.setNotification(notification)
				.putAllData(data)
				.build();

			firebaseMessaging.send(message);
			return new Message("Notification sent successfully");
		}
		else if(userStatusService.getUserStatus(user.getUserId()).equals("OFFLINE")) {
			Reminder reminder = Reminder.builder()
				.rmContent(body)
				.rmType("Friend Request")
				.user(user)
				.rmVrSession("NONE")
				.rmGuest(user.getUserId())
				.rmHost(hostUser.getUserId())
				.rmRead(false)
				.build();
			reminderRepository.save(reminder);
			return new Message("Notification sent successfully but he is OFFLINE");
		}

		return new Message("This user is not logged in.");

	}

	public Message 	failFCMMessage(FCMFailMessage fcmFailMessage) throws Exception {
		User hostUser =userRepository.findByUserId(fcmFailMessage.getSenderId()).orElseThrow(()->new Exception("호스트 유저가없어요"));
		User user = userRepository.findByUserId(fcmFailMessage.getReceiverId()).orElseThrow(()-> new Exception("받는 사람이 없어"));
		String body = "";
		if(fcmFailMessage.getVRoomType().equals("Friend Request"))	{
			body = fcmFailMessage.getSenderId()+" has declined your Friend Request.";
		} else if (fcmFailMessage.getVRoomType().equals("Room Request")){
			body = fcmFailMessage.getSenderId()+" has declined your Room Request.";
		}
		String title = "Invitation notification status";
		if(user.getToken().getTFcm() !=null){
			Reminder reminder = Reminder.builder()
				.rmContent(body)
				.rmType("Fail Request")
				.rmVrSession("NONE")
				.rmGuest(user.getUserId())
				.rmHost(hostUser.getUserId())
				.user(user)
				.rmRead(false)
				.build();
			reminderRepository.save(reminder);

			Map<String, String> data = new HashMap<>();
			data.put("rmNo", String.valueOf(reminder.getRmNo()));

			Notification notification = Notification.builder()
				.setTitle(title)
				.setBody(body)
				.build();

			com.google.firebase.messaging.Message message = com.google.firebase.messaging.Message.builder()
				.setToken(user.getToken().getTFcm())
				.setNotification(notification)
				.putAllData(data)
				.build();

			firebaseMessaging.send(message);

			return new Message("Notification sent successfully");
		}
		return new Message("The user does not exist.");
	}
}
//
// String title = "친구 초대 알림";
// String body = fcmSendFriendMessage.getUserId()+"님이 친구 초대를 하고싶어합니다";
//
// String backgroundColor ="#87CEEB";
//
//
// Notification notification = Notification.builder()
// 	.setTitle(title)
// 	.setBody(body)
// 	.build();
//
// WebpushConfig webpushConfig = WebpushConfig.builder()
// 	.setNotification(new WebpushNotification(title, body, backgroundColor))  // 배경색 설정
// 	.putData("accept", "수락")
// 	.putData("denied", "거절")
// 	.build();
//
// com.google.firebase.messaging.Message message = com.google.firebase.messaging.Message.builder()
// 	.setToken(user.getToken().getTFcm())
// 	.setNotification(notification)
// 	.setWebpushConfig(webpushConfig)
// 	.build();