package com.example.talktopia.db.entity.vr;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "save_video_room")
public class SaveVRoom {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "svr_no")
	private long svrNo;

	@CreatedDate
	@Column(name = "svr_create_time")
	private LocalDateTime svrCreateTime;

	@LastModifiedDate
	@Column(name = "svr_close_time")
	private LocalDateTime svrCloseTime;

	@Column(name = "svr_session")
	private String svrSession;

	@OneToOne(mappedBy = "saveVRoom", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
	private SaveVRoomChatLog saveVRoomChatLog;

	@Builder
	public SaveVRoom(long svrNo, LocalDateTime svrCreateTime, LocalDateTime svrCloseTime, String svrSession,
		SaveVRoomChatLog saveVRoomChatLog) {
		this.svrNo = svrNo;
		this.svrCreateTime = svrCreateTime;
		this.svrCloseTime = svrCloseTime;
		this.svrSession = svrSession;
		this.saveVRoomChatLog = saveVRoomChatLog;
	}
}
