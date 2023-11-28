package com.example.talktopia.db.entity.user;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.example.talktopia.db.entity.user.User;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "token")
public class Token {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "t_no")
	private long tNo;

	@Column(name = "t_fcm")
	private String tFcm;

	@Column(name = "t_refresh")
	private String tRefresh;

	@OneToOne
	@JoinColumn(name = "user_no")
	private User user;

	@Builder
	public Token(String tFcm, String tRefresh, User user) {
		this.tFcm = tFcm;
		this.tRefresh = tRefresh;
		this.user = user;
	}
}
