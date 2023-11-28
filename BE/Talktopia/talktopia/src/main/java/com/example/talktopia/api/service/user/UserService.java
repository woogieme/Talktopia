package com.example.talktopia.api.service.user;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.talktopia.api.request.user.GoogleReq;
import com.example.talktopia.api.request.user.PutLangReq;
import com.example.talktopia.api.request.user.UserInfoReq;
import com.example.talktopia.api.request.user.UserIdPwReq;
import com.example.talktopia.api.request.user.UserNewTokenReq;
import com.example.talktopia.api.request.user.UserSearchIdReq;
import com.example.talktopia.api.request.user.UserSearchPwReq;
import com.example.talktopia.api.response.user.UserLoginRes;
import com.example.talktopia.api.response.user.UserMyPageRes;
import com.example.talktopia.api.response.user.UserNewTokenRes;
import com.example.talktopia.api.response.user.UserSearchIdRes;
import com.example.talktopia.api.service.profile.ProfileImgService;
import com.example.talktopia.common.message.Message;
import com.example.talktopia.common.util.JwtProvider;
import com.example.talktopia.db.entity.user.Language;
import com.example.talktopia.db.entity.user.ProfileImg;
import com.example.talktopia.db.entity.user.Token;
import com.example.talktopia.db.entity.user.User;
import com.example.talktopia.db.repository.LanguageRepository;
import com.example.talktopia.db.repository.ProfileImgRepository;
import com.example.talktopia.db.repository.TokenRepository;
import com.example.talktopia.db.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Service
@Slf4j
public class UserService {

	private final PasswordEncoder bCryptPasswordEncoder;
	private final UserRepository userRepository;
	private final TokenRepository tokenRepository;
	private final LanguageRepository languageRepository;
	private final ProfileImgRepository profileImgRepository;
	private final UserMailService userMailService;
	private final UserStatusService userStatusService;

	@Value("${spring.security.jwt.secret}")
	private String secretKey;

	private final ProfileImgService profileImgService;

	final String dirName = "profile";

	// Token validate Time
	private Long accessExpiredMs = 30 * 60 * 1000L + 34200000;
	// private Long accessExpiredMs = 7 * 60 * 1000L + 32400000; // 7분 테스트
	private Long refreshExpiredMs = accessExpiredMs + 7 * 24 * 60 * 60 * 1000L;

	// 회원가입
	public Message joinUser(UserInfoReq userInfoReq) {
		isExistUser(userInfoReq.getUserId());

		// req -> toEntity -> save
		User joinUser = userInfoReq.toEntity(languageRepository.findByLangStt(userInfoReq.getUserLan()),
			profileImgRepository.findByImgNo(1L));
		joinUser.hashPassword(bCryptPasswordEncoder);

		log.info("userId: " + joinUser.getUserId());
		log.info("userEmail: " + joinUser.getUserEmail());
		// DB에 넣기전 마지막 점검
		userRepository.findByUserEmail(joinUser.getUserEmail()).ifPresent(user -> {
			throw new RuntimeException("회원 아이디가 존재합니다");
		});
		userRepository.save(joinUser);
		return new Message("회원 가입에 성공하였습니다.");
	}

	public void isExistUser(String userJoinRequestId) {
		userRepository.findByUserId(userJoinRequestId).ifPresent(user -> {
			throw new RuntimeException("회원 아이디가 존재합니다");
		});
	}

	// 로그인
	public UserLoginRes login(UserIdPwReq userIdPwReq) {
		// 아이디를 통해 있는 회원인지 확인
		User dbSearchUser = isNotExistUser(userIdPwReq.getUserId());

		// 패스워드 확인
		checkUserPw(userIdPwReq.getUserPw(), dbSearchUser.getUserPw());

		Language lan = dbSearchUser.getLanguage();

		Date now = new Date();
		// 토큰 발행f
		String accessToken = JwtProvider.createAccessToken(userIdPwReq.getUserId(), secretKey,
			new Date(now.getTime() + accessExpiredMs));
		String refreshToken = JwtProvider.createRefreshToken(userIdPwReq.getUserId(), secretKey,
			new Date(now.getTime() + refreshExpiredMs));
		saveRefreshToken(refreshToken, dbSearchUser); // refreshToken DB에 저장

		userStatusService.updateUserStatus(userIdPwReq.getUserId(),"ONLINE");

		return new UserLoginRes(userIdPwReq.getUserId(), dbSearchUser.getUserName(), accessToken,
			refreshToken,
			JwtProvider.extractClaims(accessToken, secretKey).getExpiration(), lan.getLangStt(), lan.getLangTrans(), null,
			dbSearchUser.getProfileImg().getImgUrl(), dbSearchUser.getUserRole().name());

	}

	public void saveRefreshToken(String refreshToken, User dbSearchUser) {
		// Token이 처음 발급이면 새로저장 아니면 기존거에 update
		Optional<Token> optionalToken = tokenRepository.findByUserUserNo(dbSearchUser.getUserNo());

		Token tokenToUpdate;
		if (optionalToken.isPresent()) {
			// 토큰이 이미 존재하면 업데이트
			tokenToUpdate = optionalToken.get();
			tokenToUpdate.setTRefresh(refreshToken);
		} else {
			// 토큰이 존재하지 않으면 새로 생성
			tokenToUpdate = Token.builder()
				.tFcm("11")
				.tRefresh(refreshToken)
				.user(dbSearchUser)
				.build();
		}

		tokenRepository.save(tokenToUpdate);
	}

	public User isNotExistUser(String userLoginRequestId) {
		return userRepository.findByUserId(userLoginRequestId).orElseThrow(() -> new RuntimeException("로그인에 실패했습니다."));
	}

	public void checkUserPw(String reqUserPw, String dbSearchUserPw) {
		if (!bCryptPasswordEncoder.matches(reqUserPw, dbSearchUserPw))
			throw new RuntimeException("로그인에 실패했습니다.");
	}

	// 마이페이지: 유저 정보 반환
	public UserMyPageRes myPage(String userId) {
		User user = userRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("유효하지 않은 회원입니다."));

		UserMyPageRes userMyPageRes = UserMyPageRes.builder()
			.userId(user.getUserId())
			.userPw(user.getUserPw())
			.userEmail(user.getUserEmail())
			.userName(user.getUserName())
			.userLan(user.getLanguage().getLangStt())
			.userProfileImgUrl(user.getProfileImg().getImgUrl())
			.build();

		return userMyPageRes;
	}

	// 마이페이지 checkPw
	public Message myPageCheckPw(UserIdPwReq userIdPwReq) {
		log.info("userId " + userIdPwReq.getUserId());
		User dbSearchUser = userRepository.findByUserId(userIdPwReq.getUserId())
			.orElseThrow(() -> new RuntimeException("회원이 아닙니다."));

		if (!bCryptPasswordEncoder.matches(userIdPwReq.getUserPw(), dbSearchUser.getUserPw()))
			return new Message("비밀번호가 틀렸습니다. 다시 입력해주세요.");

		return new Message("비밀번호가 인증되었습니다.");
	}

	// 새로운 토큰 요청
	public UserNewTokenRes reCreateNewToken(UserNewTokenReq userNewTokenReq) {
		// 1. userReq로 userId와 refreshToken 받음
		// 2. userId로 userNo 찾음
		String reqUserId = userNewTokenReq.getUserId();
		User user = userRepository.findByUserId(reqUserId).orElseThrow(() -> new RuntimeException("가입된 사용자가 아닙니다."));

		// 3. userNo로 Token테이블에서 token 검색
		tokenRepository.findByUserUserNo(user.getUserNo()).orElseThrow(() -> new RuntimeException("로그인된 사용자가 아닙니다."));

		Date now = new Date();
		// 4. 있으면 새로 발급해주고 resp
		String accessToken = JwtProvider.createAccessToken(user.getUserId(), secretKey,
			new Date(now.getTime() + accessExpiredMs));
		String refreshToken = JwtProvider.createRefreshToken(user.getUserId(), secretKey,
			new Date(now.getTime() + refreshExpiredMs));

		saveRefreshToken(refreshToken, user);

		return new UserNewTokenRes(reqUserId, accessToken, refreshToken,
			JwtProvider.extractClaims(accessToken, secretKey).getExpiration());
	}

	// 회원 탈퇴
	@Transactional
	public Message deleteUser(String userId) {
		User searchUser = userRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("없는 회원입니다."));

		// profileImage null로 바꾸기
		searchUser.setImageNull();

		// 삭제
		userRepository.deleteByUserId(userId).orElseThrow(() -> new RuntimeException("회원 탈퇴 실패했습니다."));

		return new Message("회원 탈퇴가 완료되었습니다.");
	}

	public String modifyUser(UserInfoReq userInfoReq) {
		// 1. 조회
		User updateUser = userRepository.findByUserId(userInfoReq.getUserId())
			.orElseThrow(() -> new RuntimeException("유효하지 않은 회원 정보입니다."));

		// 2. 수정
		updateUser.update(userInfoReq.getUserPw(), userInfoReq.getUserName(),
			languageRepository.findByLangStt(userInfoReq.getUserLan()));

		// 비밀번호 인코딩
		updateUser.hashPassword(bCryptPasswordEncoder);

		userRepository.save(updateUser);

		return updateUser.getLanguage().getLangTrans();

	}

	// 유저 아이디 찾기
	public UserSearchIdRes searchId(UserSearchIdReq userSearchIdReq) {
		User searchUser = userRepository.findByUserNameAndUserEmail(userSearchIdReq.getUserName(),
			userSearchIdReq.getUserEmail()).orElseThrow(() -> new RuntimeException("존재하는 아이디가 없습니다."));

		return new UserSearchIdRes(searchUser.getUserId());
	}

	public Message searchPw(UserSearchPwReq userSearchPwReq) throws Exception {
		// 아이디, 이름, 이메일로 존재하는 사람인지 확인
		User searchUser = userRepository.findByUserNameAndUserEmailAndUserId(userSearchPwReq.getUserName(),
				userSearchPwReq.getUserEmail(), userSearchPwReq.getUserId())
			.orElseThrow(() -> new RuntimeException("존재하는 아이디가 없습니다."));

		// tmpPw로 유저 정보 변경
		String tmpPw = userMailService.createKey();

		searchUser.update(tmpPw, userSearchPwReq.getUserName(), searchUser.getLanguage());

		// 비밀번호 인코딩
		searchUser.hashPassword(bCryptPasswordEncoder);

		userRepository.save(searchUser);

		// pw 이메일 전송, type에 랜덤값이 될 코드 전달
		userMailService.sendSimpleMessage(userSearchPwReq.getUserEmail(), tmpPw);

		return new Message("임시 비밀번호를 해당 이메일로 발송해드렸습니다.");

	}

	@Transactional
	public Message logout(String userId) {
		// 회원 조회
		User searchUser = userRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("존재하지 않는 회원입니다."));

		tokenRepository.deleteTokenByUserUserNo(searchUser.getUserNo());
		userStatusService.updateUserStatus(userId,"OFFLINE");
		return new Message("로그아웃에 성공했습니다.");
	}

	public ProfileImg uploadFile(MultipartFile profile, String userId) throws Exception {
		User user = userRepository.findByUserId(userId).orElseThrow(() -> new Exception("유저가 없어"));

		// String profileUrl = Optional.ofNullable(user.getProfileImg())
		// 	.map(ProfileImg::getImgUrl)
		// 	.orElse(null);
		//
		// if (profileUrl != null) {
		// 	profileImgService.delete(profileUrl);
		// }

		ProfileImg url = profileImgService.upload(profile, dirName, userId);
		log.info("profile image uploaded successfully");
		user.setProfileImg(url);
		userRepository.save(user);
		log.info("user info changed successfully");

		return url;
	}

	public Message deleteProfile(String userId) {

		User user = userRepository.findByUserId(userId).orElseThrow();
		// 프로필 사진 url 가져오기
		String fileUrl = user.getProfileImg().getImgUrl();
		log.info("fileUrl in S3: {}", fileUrl);
		// S3에서 삭제하기
		profileImgService.delete(fileUrl);
		log.info("file deletion success in userService");
		// DB 프로필 사진 삭제하기
		user.setProfileImg(null);
		userRepository.save(user);
		return new Message("이미지가 삭제되었습니다");
	}

	public UserLoginRes googleLogin(GoogleReq googleReq) {

		// 1. 로그인 한다고 req들어옴

		// 2. 이미 가입된 회원인지 아닌지 구별 - 이메일로 구별
		Optional<User> optionalUser = userRepository.findByUserEmail(googleReq.getUserEmail());
		User joinUser = null;
		String sttLang = null;
		String transLang = null;

		// 3. 가입안되어있으면 가입 후 로그인
		if(optionalUser.isEmpty()) {
			log.info("isEmpty 시작");
			joinUser = googleJoin(googleReq);
			log.info("isEmpty 끝 " + joinUser);
		} else {
			joinUser = optionalUser.get();
			sttLang = joinUser.getLanguage().getLangStt();
			transLang = joinUser.getLanguage().getLangTrans();
		}

		// 4. 이미 가입되었으면 로그인 -> UserLoginRes에 msg추가 기본은 null, 추가 필요하면 "add"
		Date now = new Date();
		// 토큰 발행
		String accessToken = JwtProvider.createAccessToken(joinUser.getUserId(), secretKey,
			new Date(now.getTime() + accessExpiredMs));
		String refreshToken = JwtProvider.createRefreshToken(joinUser.getUserId(), secretKey,
			new Date(now.getTime() + refreshExpiredMs));
		saveRefreshToken(refreshToken, joinUser); // refreshToken DB에 저장

		userStatusService.updateUserStatus(joinUser.getUserId(),"ONLINE");

		log.info("소셜 로그인 image: " + joinUser.getProfileImg().getImgUrl());
		return new UserLoginRes(joinUser.getUserId(), joinUser.getUserName(), accessToken,
			refreshToken,
			JwtProvider.extractClaims(accessToken, secretKey).getExpiration(), sttLang, transLang, "add",
			joinUser.getProfileImg().getImgUrl(), joinUser.getUserRole().name());

	}

	public User googleJoin(GoogleReq googleReq) {


		// req -> toEntity -> save
		// DB에 넣기전 마지막 점검
		userRepository.findByUserEmail(googleReq.getUserEmail())
			.ifPresent(user -> new RuntimeException("이미 존재하는 회원입니다."));
		log.info("DB 넣기전 마지막 점검");
		ProfileImg profileImg = profileImgRepository.findByImgNo(1L);
		User joinUser = googleReq.toEntity(profileImg);
		userRepository.save(joinUser);

		return joinUser;
	}

	// 추가 정보 넣기
	@Transactional
	public String putLang(PutLangReq putLangReq) {

		User searchUser = userRepository.findByUserId(putLangReq.getUserId()).orElseThrow(() -> new RuntimeException("등록된 회원이 아닙니다."));

		// 언어 꺼내기
		Language language = languageRepository.findByLangStt(putLangReq.getUserLan());

		searchUser.update(searchUser.getUserPw(), searchUser.getUserName(), language);

		userRepository.save(searchUser);

		return language.getLangTrans();


	}
}
