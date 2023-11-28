package com.example.talktopia.api.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.talktopia.api.response.user.ReportedUserRes;
import com.example.talktopia.db.entity.user.ReportedUser;
import com.example.talktopia.db.repository.ReportedUserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReportedUserService {

	private final ReportedUserRepository reportedUserRepository;

	public List<ReportedUserRes> getList() {
		List<ReportedUser> list = reportedUserRepository.findAll();
		List<ReportedUserRes> reportedList = new ArrayList<>();

		for (ReportedUser user: list) {
			reportedList.add(new ReportedUserRes(user.getRuId(), user.getRuReportCount(), user.getRuReporter(),
				user.getRuBully(), user.getRuBody(), user.getRuCreateTime(), user.getRuVrSession()));
		}

		return reportedList;
	}
}
