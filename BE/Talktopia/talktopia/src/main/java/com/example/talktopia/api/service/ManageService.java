package com.example.talktopia.api.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.talktopia.api.request.ReportReq;
import com.example.talktopia.common.message.Message;
import com.example.talktopia.db.entity.user.Category;
import com.example.talktopia.db.entity.user.ReportedUser;
import com.example.talktopia.db.entity.user.User;
import com.example.talktopia.db.entity.vr.Participants;
import com.example.talktopia.db.repository.CategoryRepository;
import com.example.talktopia.db.repository.ParticipantsRepository;
import com.example.talktopia.db.repository.ReportedUserRepository;
import com.example.talktopia.db.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class ManageService {

	private final UserRepository userRepository;
	private final ParticipantsRepository participantsRepository;
	private final ReportedUserRepository reportedUserRepository;
	private final CategoryRepository categoryRepository;

	public Message reportUser(ReportReq reportReq) throws Exception {

		//1. 신고 유저가 존재하는가? Y
		//1. 신고 당한유저가 존재하는가? Y
		//1. 신고 유저와 신고 당한 유저는 같은 방에 존재하는가? Y
		//1. 참여자 DB에 존재하는가? Y

		//1. 신고 유저가 방에 있는가? Y
		//2. 신고당한유저가 방에 있는가? Y
		//3. 신고 당한 유저는 같은 방에서 신고를 당했었나?
		//3-1. 신고를 당했으면  같은 방에있는 신고 유저가 신고를 했었나? -> 이건 안된다고 말해주자
		//3-2. 신고를 당했지만 같은 방에있는 새로운 신고를 당한것인가? -> 신고해주자.

		//1. 신고 유저가 존재하는가?
		User user = userRepository.findByUserId(reportReq.getRuReporter()).orElseThrow(()->new Exception("신고하는 유저가 없습니다"));
		String reporter = user.getUserId();
		//1. 신고 당한유저가 존재하는가?
		Optional<User> bullyUsers = userRepository.findByUserId(reportReq.getRuBully());
		if (bullyUsers.isEmpty()) {
			throw new Exception("There are no users who are being reported");
		}
		String bully = bullyUsers.get().getUserId();


		Participants participants = participantsRepository.findByUser_UserId(reporter).orElseThrow(()-> new Exception("방에 존재하지않는 유저"));
		String reporterVRoom = participants.getVRoom().getVrSession();
		participants = participantsRepository.findByUser_UserId(bully).orElseThrow(()-> new Exception("방에 존재하지않는 유저"));
		String bullyVRoom = participants.getVRoom().getVrSession();

		//1.신고 유저와 신고 당한 유저는 같은 방에 존재하는가?
		if(reportReq.getVrSession().equals(reporterVRoom) && reportReq.getVrSession().equals(bullyVRoom)) {
			//3-1. 신고를 당했으면  같은 방에있는 신고 유저가 신고를 했었나? -> 이건 안된다고 말해주자
			log.info(reportReq.getVrSession());
			log.info(bully);
			log.info(reporter);
			if (reportedUserRepository.existsByRuVrSessionAndRuBullyAndRuReporter(reportReq.getVrSession(), bully, reporter)) {
				return new Message("I already reported it");
			} //end for 이미 신고한놈
		//3-2. 신고를 안당하고 같은 방에서 새로운 신고를 당한것인가? -> 신고해주자.
		//3-3. 신고를 당했지만 다른 사람에게 새로운 시고를 당한것인가? -> 신고해줘야지
			else {
					//신고 당한 전적이 있는놈
				if (reportedUserRepository.existsByRuVrSessionAndRuBully(reportReq.getVrSession(), bully)) {

					ReportedUser reportedUser = ReportedUser.builder()
						.ruReportCount(1)
						.ruBody(reportReq.getRuBody())
						.ruCreateTime(LocalDateTime.now())
						.ruVrSession(reportReq.getVrSession())
						.ruReporter(reportReq.getRuReporter())
						.user(user)
						.ruBully(reportReq.getRuBully())
						.build();
					reportedUserRepository.save(reportedUser);
					int size = reportReq.getRuCategory().size();
					for (int i = 0; i < size; i++) {
						Category category = Category.builder()
							.categoryType(reportReq.getRuCategory().get(i))
							.reportedUser(reportedUser)
							.build();
						categoryRepository.save(category);
					}
					//신고가 당한적이 있지만 다른사람한테 신고가 되었습니다
					return new Message("I've been reported, but I've been reported to someone else");
				}
				//신고 당한 전적이 없는놈
				//3-2. 신고를 안당하고 같은 방에서 새로운 신고를 당한것인가? -> 신고해주자.
				int size = reportReq.getRuCategory().size();
				ReportedUser reportedUser = ReportedUser.builder()
					.ruReportCount(1)
					.ruBody(reportReq.getRuBody())
					.ruCreateTime(LocalDateTime.now())
					.ruVrSession(reportReq.getVrSession())
					.ruReporter(reportReq.getRuReporter())
					.user(user)
					.ruBully(reportReq.getRuBully())
					.build();
				reportedUserRepository.save(reportedUser);
				log.info(String.valueOf(reportedUser.getRuId()));
				for (int i = 0; i < size; i++) {
					Category category = Category.builder()
						.categoryType(reportReq.getRuCategory().get(i))
						.reportedUser(reportedUser)
						.build();
					categoryRepository.save(category);
				}
				return new Message("I reported it.");
			}//end for 이미 신고한 전적이 있는놈
		}
		return new Message("The reported user and the reported user are not in the same room.b");


	}

	// 신고된

}
