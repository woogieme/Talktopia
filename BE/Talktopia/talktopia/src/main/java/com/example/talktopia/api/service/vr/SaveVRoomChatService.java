package com.example.talktopia.api.service.vr;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.example.talktopia.api.request.vr.ChatLogsRequest;
import com.example.talktopia.api.request.vr.SaveChatLog;
import com.example.talktopia.api.response.vr.SaveVRoomChatLogRes;
import com.example.talktopia.common.message.Message;
import com.example.talktopia.db.entity.vr.SaveVRoom;
import com.example.talktopia.db.entity.vr.SaveVRoomChatLog;
import com.example.talktopia.db.repository.SaveVRoomChatLogRepository;
import com.example.talktopia.db.repository.SaveVRoomRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class SaveVRoomChatService {

	@Value("${cloud.aws.s3.bucket}")
	private String bucket;

	private final AmazonS3Client amazonS3Client;
	private final SaveVRoomChatLogRepository saveVRoomChatLogRepository;
	private final SaveVRoomRepository saveVRoomRepository;

	// 채팅 로그 파일로 저장
	public Message saveLog(ChatLogsRequest chatLogsRequest) {
		String fileName = chatLogsRequest.getVrSession() + ".txt";

		try (OutputStreamWriter writer = new OutputStreamWriter(new FileOutputStream(fileName), "UTF-8")) {
			// Write conversationLog
			for (SaveChatLog log : chatLogsRequest.getConversationLog()) {
				writer.write("[ConversationLog] Sender: " + log.getSender() + ", Message: " + log.getMessage() + "\n");
			}
			// Write chatLog
			for (SaveChatLog log : chatLogsRequest.getChatLog()) {
				writer.write("[ChatLog] Sender: " + log.getSender() + ", Message: " + log.getMessage() + "\n");
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

		// Upload file to S3
		try {
			File file = new File(fileName);
			PutObjectRequest putObjectRequest = new PutObjectRequest(bucket, fileName, file);
			ObjectMetadata metadata = new ObjectMetadata();
			metadata.setContentType("text/plain; charset=UTF-8");
			putObjectRequest.setMetadata(metadata);
			amazonS3Client.putObject(putObjectRequest);

			// Delete local file
			file.delete();
		} catch (Exception e) {
			e.printStackTrace();
		}

		String logFileUrl = amazonS3Client.getUrl(bucket, fileName).toString();
		SaveVRoom saveVRoom = saveVRoomRepository.findBySvrSession(chatLogsRequest.getVrSession());
		log.info("saveVRoom " + saveVRoom);
		SaveVRoomChatLog saveVRoomChatLog = SaveVRoomChatLog.builder()
			.vrChatLogFileUrl(logFileUrl)
			.saveVRoom(saveVRoom)
			.build();

		log.info("저장전 log: " + saveVRoomChatLog);
		saveVRoomChatLogRepository.save(saveVRoomChatLog);

		return new Message("저장된 채팅 로그 파일명: " + logFileUrl);
	}

	// 목록 가져오기
	public List<SaveVRoomChatLogRes> chatLogList() {
		List<SaveVRoomChatLogRes> resList = new ArrayList<>();

		// SaveChatLog 전체 조회
		List<SaveVRoomChatLog> logList = saveVRoomChatLogRepository.findAll();

		// 해당 SaveVRoom 값들 Res로 Build 후 list에 추가
		if (!logList.isEmpty()) {
			for (SaveVRoomChatLog logs : logList) {
				SaveVRoom saveVRoom = logs.getSaveVRoom();
				if (saveVRoom != null) {
					resList.add(new SaveVRoomChatLogRes(logs.getVrLogNo(), saveVRoom.getSvrCreateTime(),
						saveVRoom.getSvrCloseTime(), saveVRoom.getSvrSession(),
						logs.getVrChatLogFileUrl()));
				}
			}
		}

		// return
		return resList;
	}
}
