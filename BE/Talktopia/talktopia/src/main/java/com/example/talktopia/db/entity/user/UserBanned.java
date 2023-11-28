package com.example.talktopia.db.entity.user;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "user_banned")
public class UserBanned {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ub_no")
	private long ubNo;

	@Column(name = "ub_user_id")
	private String userId;

}
