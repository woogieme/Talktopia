package com.example.talktopia.db.entity.vr;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import com.example.talktopia.common.util.VRoomType;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "video_room")
public class VRoom {

	@Id
	@Column(name = "vr_session")
	private String vrSession;

	@Column(name = "vr_max_cnt")
	private int vrMaxCnt;

	@Column(name = "vr_enter")
	private boolean vrEnter;

	@Enumerated(EnumType.STRING)
	@Column(name = "vr_type")
	private VRoomType vrType;

	@CreatedDate
	@Column(name = "vr_create_time")
	private LocalDateTime vrCreateTime;

	@Column(name = "vr_curr_cnt")
	private int vrCurrCnt;

	@LastModifiedDate
	@Column(name = "vr_close_time")
	private LocalDateTime vrCloseTime;

	@OneToMany(mappedBy = "vRoom", cascade = CascadeType.ALL)
	private List<Participants> participantsList = new ArrayList<>();

	@Builder
	public VRoom(String vrSession, int vrMaxCnt, boolean vrEnter, VRoomType vrType, LocalDateTime vrCreateTime,
		int vrCurrCnt, LocalDateTime vrCloseTime) {
		this.vrSession = vrSession;
		this.vrMaxCnt = vrMaxCnt;
		this.vrEnter = vrEnter;
		this.vrType = vrType;
		this.vrCreateTime = vrCreateTime;
		this.vrCurrCnt = vrCurrCnt;
		this.vrCloseTime = vrCloseTime;
	}
}
