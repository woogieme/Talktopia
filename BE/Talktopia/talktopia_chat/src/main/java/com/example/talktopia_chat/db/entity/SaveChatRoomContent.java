package com.example.talktopia_chat.db.entity;

import java.time.LocalDateTime;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedDate;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "save_chat_room_content")
public class SaveChatRoomContent {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "scrc_no")
	private long scrcNo;

	@Column(name = "scrc_content", length = 255)
	private String scrcContent;

	@Column(name = "scrc_sender_id", length = 50)
	private String scrcSenderId;

	// @CreatedDate
	// @Temporal(TemporalType.TIMESTAMP)
	@Column(name="scrc_send_time", columnDefinition = "TIMESTAMP(3)")
	private LocalDateTime scrcSendTime;


	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="scrc_cr_no")
	private ChatRoom chatRoom;

	private  void setChatRoom(ChatRoom chatRoom){
		this.chatRoom = chatRoom;
		if(chatRoom != null){
			chatRoom.getSaveChatRoomContentsList().add(this);
		}
	}

	@Builder
	public SaveChatRoomContent(long scrcNo, String scrcContent, String scrcSenderId, LocalDateTime scrcSendTime,
		ChatRoom chatRoom) {
		this.scrcNo = scrcNo;
		this.scrcContent = scrcContent;
		this.scrcSenderId = scrcSenderId;
		this.scrcSendTime = scrcSendTime;
		this.chatRoom = chatRoom;
	}

	@Override
	public String toString() {
		return "SaveChatRoomContent{" +
			"scrcNo=" + scrcNo +
			", scrcContent='" + scrcContent + '\'' +
			", scrcSenderId='" + scrcSenderId + '\'' +
			", scrcSendTime=" + scrcSendTime +
			", chatRoom=" + chatRoom +
			'}';
	}
}
