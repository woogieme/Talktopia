package com.example.talktopia_chat.common.util;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;

import com.example.talktopia_chat.db.entity.SaveChatRoomContentRedis;

import lombok.RequiredArgsConstructor;

/**
 * RedisTemplate에서 불러진 ZSet을 List로바꿈
 * */
public class ChatSetToListUtil {

	public static List<SaveChatRoomContentRedis> convert(String sessionId,
		RedisTemplate<String, SaveChatRoomContentRedis> redisTemplate) {

		Set<ZSetOperations.TypedTuple<SaveChatRoomContentRedis>> chatSet =
			redisTemplate.opsForZSet().rangeByScoreWithScores(sessionId, 0, Double.MAX_VALUE);

		if(chatSet==null) return null;

		// Set<TypedTuple>를 List로 변환하여 정렬
		List<SaveChatRoomContentRedis> res = chatSet.stream()
			.sorted(Comparator.comparing(ZSetOperations.TypedTuple::getScore))
			.map(ZSetOperations.TypedTuple::getValue)
			.collect(Collectors.toList());

		return res;
	}
}
