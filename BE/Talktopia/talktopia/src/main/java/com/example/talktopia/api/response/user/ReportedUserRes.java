package com.example.talktopia.api.response.user;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.springframework.data.annotation.CreatedDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportedUserRes {
	private long ruId;
	private long ruReportCount;
	private String ruReporter;
	private String ruBully;
	private String ruBody;
	private LocalDateTime ruCreateTime;
	private String ruVrSession;
}
