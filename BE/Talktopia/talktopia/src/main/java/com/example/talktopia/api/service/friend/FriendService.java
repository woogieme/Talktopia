package com.example.talktopia.api.service.friend;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.talktopia.api.request.FindUserReq;
import com.example.talktopia.api.request.friend.FriendIdPwReq;
import com.example.talktopia.api.request.friend.FriendReq;
import com.example.talktopia.api.request.friend.UnknownUserReq;
import com.example.talktopia.api.service.user.UserStatusService;
import com.example.talktopia.common.message.Message;
import com.example.talktopia.db.entity.friend.Friend;
import com.example.talktopia.db.entity.user.Language;
import com.example.talktopia.db.entity.user.User;
import com.example.talktopia.db.repository.FriendRepository;
import com.example.talktopia.db.repository.LanguageRepository;
import com.example.talktopia.db.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class FriendService {

	private final FriendRepository friendRepository;
	private final UserRepository userRepository;
	private final UserStatusService userStatusService;
	private final LanguageRepository languageRepository;

	// 친구 추가
	public Message addFriend(FriendIdPwReq friendIdPwReq) {
		// userId 기준으로 추가
		User user = findUser(friendIdPwReq.getUserId());

		// partId 기준으로 추가
		User friend = findUser(friendIdPwReq.getPartId());

		// userId로 no 찾기
		long userNo = user.getUserNo();
		long friendNo = friend.getUserNo();

		// 중복 체크
		if (isAlreadyFriend(userNo, friendNo)) {
			throw new RuntimeException("중복된 친구입니다.");
		}

		// 양방향 셋팅
		Friend newFriend = Friend.builder()
			.frFriendNo(friend.getUserNo())
			.user(user)
			.build();

		Friend reverseFriend = Friend.builder()
			.frFriendNo(user.getUserNo())
			.user(friend)
			.build();

		friendRepository.save(newFriend);
		friendRepository.save(reverseFriend);

		return new Message("친구 등록이 완료되었습니다.");
	}

	public Message deleteFriend(FriendIdPwReq friendIdPwReq) {

		User user = findUser(friendIdPwReq.getUserId());
		User friend = findUser(friendIdPwReq.getPartId());

		Friend f1 = friendRepository.findByUser_UserNoAndFrFriendNo(user.getUserNo(), friend.getUserNo());
		Friend f2 = friendRepository.findByUser_UserNoAndFrFriendNo(friend.getUserNo(), user.getUserNo());

		// 친구 엔티티가 null인 경우 또는 이미 삭제된 경우
		if (f1 == null || f2 == null) {
			throw new RuntimeException("친구 삭제에 실패했습니다.");
		}

		// 양방향 관계에서 관계 해제
		user.getFriends().remove(f1);
		friend.getFriends().remove(f2);

		// 친구 엔티티 삭제
		friendRepository.delete(f1);
		friendRepository.delete(f2);

		return new Message("친구를 삭제하였습니다.");
	}

	// 유저 찾기
	public User findUser(String userId) {
		return userRepository.findByUserId(userId)
			.orElseThrow(() -> new RuntimeException("해당 유저가 존재하지 않습니다."));
	}

	// 중복 찾기
	public boolean isAlreadyFriend(long userNo, long friendNo) {
		// 초대를 보낸 유저의 친구 리스트
		List<Friend> friends1 = friendRepository.findByUser_UserNo(userNo);

		// 초대를 받은 유저의 친구 리스트
		List<Friend> friends2 = friendRepository.findByUser_UserNo(friendNo);

		// 초대 보낸 유저의 친구들 중 초대한 친구가 있으면
		for (Friend f : friends1) {
			if (f.getFrFriendNo() == friendNo) {
				log.info("friendNo1" + f.getFrFriendNo());
				return true; // 이미 친구
			}
		}

		// 초대 받은 유저의 친구들 중 초대한 친구가 있으면
		for (Friend f : friends2) {
			if (f.getFrFriendNo() == userNo) {
				log.info("friendNo2" + f.getFrFriendNo());
				return true;
			}
		}
		return false; // 친구가 아님
	}

	// 친구목록 불러오기
	public List<UnknownUserReq> getFriends(String userId) {
		User user = findUser(userId);
		List<Friend> arr = friendRepository.findByUser_UserNo(user.getUserNo());
		List<UnknownUserReq> res = new ArrayList<>();
		for (Friend f : arr) {
			User temp = userRepository.findByUserNo(f.getFrFriendNo());
			String langTrans = languageRepository.findByLangName(temp.getLanguage().getLangName()).getLangTrans();

			String userStatus = userStatusService.getUserStatus(temp.getUserId());
			UnknownUserReq friend = UnknownUserReq.builder()
				.userId(temp.getUserId())
				.userImg(temp.getProfileImg().getImgUrl())
				.userLng(temp.getLanguage().getLangName())
				.userLngImg(temp.getLanguage().getLangFlagImgUrl())
				.userStatus(userStatus)
				.userName(temp.getUserName())
				.userLangTrans(langTrans)
				.build();
			res.add(friend);
		}
		return res;
	}

	//유저 검색해서 내보내기.
	public List<UnknownUserReq> findUserId(FindUserReq findUserReq) throws Exception {
		User userNo = userRepository.findByUserId(findUserReq.getUserId()).orElseThrow(() -> new Exception("유저가 없어"));

		List<User> arr;
		List<UnknownUserReq> res = new ArrayList<>();
		if (findUserReq.getFindType().equals("EMAIL")) {
			arr = userRepository.findByCustomUserEmail(findUserReq.getSearch());
			if (arr == null) {
				return res;
			}
		} else if (findUserReq.getFindType().equals("ID")) {
			arr = userRepository.findByCustomUserId(findUserReq.getSearch());
			if (arr == null) {
				return res;
			}
		} else if (findUserReq.getFindType().equals("LANG")) {
			Language lan = languageRepository.findByLangName(findUserReq.getLanguage());
			long lanNo = lan.getLangNo();
			log.info("왜 이걸로 안뜨지?" + lanNo + " " + findUserReq.getLanguage());
			arr = userRepository.findByCustomUserLANG(lanNo);
			if (arr == null) {
				return res;
			}
		} else {
			throw new Exception("옳지 않은 검색 방식입니다");
		}
		for (User user : arr) {
			if (user.getUserNo() == userNo.getUserNo()) {
				continue;
			}
			String userStatus = userStatusService.getUserStatus(user.getUserId());
			if (userStatus == null) {
				continue;
			}
			long frId = userRepository.findByUserNo(user.getUserNo()).getUserNo();
			Friend friend = friendRepository.findByUser_UserNoAndFrFriendNo(userNo.getUserNo(), frId);
			if (friend != null) {
				continue;
			}
			UnknownUserReq friendReq = UnknownUserReq.builder()
				.userId(user.getUserId())
				.userStatus(userStatus)
				.userName(user.getUserName())
				.userImg(user.getProfileImg().getImgUrl())
				.userLngImg(user.getLanguage().getLangFlagImgUrl())
				.userLng(user.getLanguage().getLangName())
				.build();
			res.add(friendReq);
		}
		return res;
	}
}
