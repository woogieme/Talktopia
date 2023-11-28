package com.example.talktopia.db.entity.user;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "profile_images")
public class ProfileImg {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "img_no")
	private long imgNo;

	@Column(name = "img_url")
	private String imgUrl;

	@Builder
	public ProfileImg(long imgNo, String imgUrl) {
		this.imgNo = imgNo;
		this.imgUrl = imgUrl;
	}
}
