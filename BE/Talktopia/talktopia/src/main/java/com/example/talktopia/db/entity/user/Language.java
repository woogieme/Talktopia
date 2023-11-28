package com.example.talktopia.db.entity.user;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "language")
public class Language {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "lang_no")
	private long langNo;

	@Column(length = 20, name = "lang_name")
	private String langName;

	@Column(length = 15, name = "lang_stt")
	private String langStt;

	@Column(name = "lang_flag_img_url")
	private String langFlagImgUrl;

	@Column(length = 15, name = "lang_trans")
	private String langTrans;
}
