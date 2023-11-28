package com.example.talktopia.api.response;

import com.example.talktopia.db.entity.user.User;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReminderBodyRes {
	long rmNo;
	boolean rmRead;
	String rmContent;
	String rmType;
	String rmVrSession;
	String rmHost;
	String rmGuest;
	long receiverNo;

	@Builder
	public ReminderBodyRes(long rmNo, boolean rmRead, String rmContent, String rmType, String rmVrSession,
		String rmHost,String rmGuest,
		long receiverNo) {
		this.rmNo = rmNo;
		this.rmRead = rmRead;
		this.rmContent = rmContent;
		this.rmType = rmType;
		this.rmVrSession = rmVrSession;
		this.rmHost = rmHost;
		this.rmGuest=rmGuest;
		this.receiverNo = receiverNo;
	}
}
