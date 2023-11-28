package com.example.talktopia.db.entity.user;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.springframework.data.annotation.CreatedDate;

import com.example.talktopia.db.entity.user.User;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "reported_user")
public class ReportedUser {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ru_id")
	private long ruId;

	@Column(name = "ru_report_count")
	private long ruReportCount;

	@Column(name = "ru_reporter")
	private String ruReporter;

	@Column(name = "ru_bully")
	private String ruBully;

	@Column(name = "ru_body")
	private String ruBody;

	@CreatedDate
	@Column(name = "ru_create_time")
	private LocalDateTime ruCreateTime;

	@CreatedDate
	@Column(name = "ru_vr_session")
	private String ruVrSession;

	@ManyToOne
	@JoinColumn(name = "user_no")
	private User user;

	@OneToMany(mappedBy = "reportedUser", cascade = CascadeType.ALL)
	private List<Category> categoryList = new ArrayList<>();

	@Builder
	public ReportedUser(long ruId, long ruReportCount, String ruReporter, String ruBully, String ruBody,
		User user,LocalDateTime ruCreateTime,String ruVrSession) {
		this.ruId = ruId;
		this.ruReportCount = ruReportCount;
		this.ruReporter = ruReporter;
		this.ruCreateTime=ruCreateTime;
		this.ruBully = ruBully;
		this.ruBody = ruBody;
		this.ruVrSession=ruVrSession;
		setUserStatus(user);
	}

	public void setUserStatus(User user) {
		this.user = user;
		if (user != null) {
			user.getReportedUser().add(this);
		}
	}

}
