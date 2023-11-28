package com.example.talktopia.api.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReminderInviteReq {
	String rmType;
	String rmVrSession;
	String rmHost;
	long receiverNo;
}
