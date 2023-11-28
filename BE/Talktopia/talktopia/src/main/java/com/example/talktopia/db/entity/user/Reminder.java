package com.example.talktopia.db.entity.user;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "reminder")
public class Reminder {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "rm_no")
	private long rmNo;

	@Column(name = "rm_read")
	private boolean rmRead;

	@Column(name = "rm_content")
	private String rmContent;

	@Column(length = 100,name = "rm_type")
	private String rmType;

	@Column(name="rm_vr_session")
	private String rmVrSession;

	@Column(name = "rm_host")
	private String rmHost;

	@Column(name = "rm_guest")
	private String rmGuest;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_no")
	private User user;

	@Builder
	public Reminder(long rmNo, boolean rmRead, String rmContent, String rmType, String rmVrSession,String rmHost,User user,String rmGuest) {
		this.rmNo = rmNo;
		this.rmRead = rmRead;
		this.rmContent = rmContent;
		this.rmType = rmType;
		this.rmVrSession=rmVrSession;
		this.rmHost=rmHost;
		this.rmGuest=rmGuest;
		setReminder(user);
	}

	public void setReminder(User user) {
		this.user = user;
		user.getReminderList().add(this);
	}
}
