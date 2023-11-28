package com.example.talktopia.db.entity.vr;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "save_video_room_chat_log")
public class SaveVRoomChatLog {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "svrcl_no")
	private long vrLogNo;

	@Column(length = 500, name = "svrcl_file_url")
	private String vrChatLogFileUrl;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "svr_no")
	private SaveVRoom saveVRoom;

	@Builder
	public SaveVRoomChatLog(String vrChatLogFileUrl, SaveVRoom saveVRoom) {
		this.vrChatLogFileUrl = vrChatLogFileUrl;
		this.saveVRoom = saveVRoom;
	}
}
