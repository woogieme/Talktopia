package com.example.talktopia_chat.db.entity;

import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;

import org.springframework.data.redis.core.RedisHash;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
// value는 redis의 keyspace
// timeToLive는 만료시간이고 -1L은 만료시간 없음
// @RedisHash(value="save_chat_room_content", timeToLive = -1L) <- redis repository안쓰면 필요X
public class SaveChatRoomContentRedis {
	// @Id // keyspace:id
	// private String scrcSession; // scrcSession(세션아이디)가 redis key.
	// private int
	private String scrcSenderId;
	private String scrcContent;
	private String scrcSendTime;

	// cache-through할 때 db로부터 캐싱된 값인지 알리는 필드.
	// cache-through 후 write-back할 때 db로부터 불러진 데이터가 중복저장되는 것을 피하기 위함
	private boolean scrcCached;

	@Builder
	public SaveChatRoomContentRedis(String scrcSenderId, String scrcContent,
		String scrcSendTime, boolean scrcCached) {
		this.scrcSenderId = scrcSenderId;
		this.scrcContent = scrcContent;
		this.scrcSendTime = scrcSendTime;
		this.scrcCached = scrcCached;
	}
}
