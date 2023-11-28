package com.example.talktopia.common.util;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MapSession {
	String roomId;

	String token;

	List<Long> lang;

	int maxCount;
	int curCount;

	public MapSession(String roomId, String token, List<Long> lang, int maxCount, int curCount) {
		this.roomId = roomId;
		this.token = token;
		this.lang = lang;
		this.maxCount = maxCount;
		this.curCount = curCount;
	}
}
