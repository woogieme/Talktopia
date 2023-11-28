package com.example.talktopia.api.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReminderRes {

	private long rmNo;
	private String rmContent;
	private String rmType;
	private boolean rmRead;

	@Builder
	public ReminderRes(long rmNo, String rmContent, String rmType, boolean rmRead) {
		this.rmNo = rmNo;
		this.rmContent = rmContent;
		this.rmType = rmType;
		this.rmRead = rmRead;
	}
}
