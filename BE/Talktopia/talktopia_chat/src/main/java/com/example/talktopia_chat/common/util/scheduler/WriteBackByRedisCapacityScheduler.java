package com.example.talktopia_chat.common.util.scheduler;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BoundZSetOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.talktopia_chat.api.service.SaveChatRoomContentRedisService;
import com.example.talktopia_chat.db.entity.ChatRoom;
import com.example.talktopia_chat.db.entity.SaveChatRoomContent;
import com.example.talktopia_chat.db.entity.SaveChatRoomContentRedis;
import com.example.talktopia_chat.db.repository.ChatRoomRepository;
import com.example.talktopia_chat.db.repository.SaveChatRoomContentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class WriteBackByRedisCapacityScheduler {

	private final RedisTemplate<String, SaveChatRoomContentRedis> redisTemplate;
	private final WriteBackRedisByKey writeBackRedisByKey;
	private final ChatRoomRepository chatRoomRepository;

	// 1시간 마다 200사이즈 넘는 Redis -> MySQL
	@Scheduled(cron = "0 0 0/1 * * *") // 1시간마다 실행
	// @Scheduled(cron = "0 0/2 * * * *") // 2분마다 실행
	public void writeBack() {
		log.info("writeBack 시작");

		// redis에 존재하는 모든 key값 찾아야함(ZSet인거만)
		// redisTemplate.keys() <-이거 쓰면 ZSet 아닌 것도 나와서 오류남
		List<ChatRoom> chatRooms = chatRoomRepository.findAll();
		for(ChatRoom cr : chatRooms){
			String key =  cr.getCrSession();
			Long zSetSize = redisTemplate.opsForZSet().size(key);
			if(zSetSize!=null && zSetSize>=200){
				log.info("'{}'키의 사이즈는 {}. 백업함.", key, zSetSize);
				writeBackRedisByKey.writeBackForKey(key);
			}
		}
	}

}
