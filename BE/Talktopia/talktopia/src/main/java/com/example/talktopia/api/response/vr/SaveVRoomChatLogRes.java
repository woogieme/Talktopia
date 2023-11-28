package com.example.talktopia.api.response.vr;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SaveVRoomChatLogRes {
	private long svrNo;
	private LocalDateTime svrCreateTime;
	private LocalDateTime svrCloseTime;
	private String svrSession;
	private String logFileUrl;
}
