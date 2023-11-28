package com.example.talktopia.db.entity.user;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.talktopia.db.entity.friend.Friend;
import com.example.talktopia.db.entity.post.Post;
import com.example.talktopia.db.entity.vr.Participants;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "user")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_no")
	private long userNo;

	@Column(length = 50, name = "user_id")
	private String userId;

	@Column(length = 100, name = "user_pw")
	private String userPw;

	@Column(length = 30, name = "user_name")
	private String userName;

	@Column(length = 45, name = "user_email")
	private String userEmail;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "user_img_no")
	private ProfileImg profileImg;

	@OneToOne
	@JoinColumn(name = "user_lang_no")
	private Language language;

	@Column(name = "provider_type")
	@Enumerated(EnumType.STRING)
	private ProviderType providerType;

	@Enumerated(EnumType.STRING)
	private UserRole userRole;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	private List<Participants> participantsList = new ArrayList<>();

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	private List<Reminder> reminderList = new ArrayList<>();

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	private List<ReportedUser> reportedUser = new ArrayList<>();

	// 양방향 매핑
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	private List<Friend> friends = new ArrayList<>();

	@OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
	private Token token;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	private List<Post> postList = new ArrayList<>();

	@Builder
	public User(long userNo, String userId, String userPw, String userName, String userEmail, ProfileImg profileImg,
		Language language, ProviderType providerType, UserRole userRole) {
		this.userNo = userNo;
		this.userId = userId;
		this.userPw = userPw;
		this.userName = userName;
		this.userEmail = userEmail;
		this.profileImg = profileImg;
		this.language = language;
		this.providerType = providerType;
		this.userRole = userRole;
	}

	public void update(String userPw, String userName, Language language) {
		this.userPw = userPw;
		this.userName = userName;
		this.language = language;
	}

	public User hashPassword(PasswordEncoder passwordEncoder) {
		this.userPw = passwordEncoder.encode(this.userPw);
		return this;
	}

	public User update(String name) {
		this.userName=name;
		return this;
	}

	// Friend와 연관관계 편의 메서드
	public void addFriend(Friend friend) {
		this.friends.add(friend);
		if(friend.getUser() != this) {
			friend.setUser(this);
		}
	}

	public void setImageNull() {
		this.profileImg = null;
	}
}
