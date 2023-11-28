package com.example.talktopia.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.talktopia.api.response.user.ReportedUserRes;
import com.example.talktopia.api.service.ReportedUserService;
import com.example.talktopia.db.entity.user.ReportedUser;
import com.example.talktopia.db.repository.ReportedUserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/report")
public class ReportController {

	private final ReportedUserService reportedUserService;
	@GetMapping("/list")
	public List<ReportedUserRes> getList() {

		return reportedUserService.getList();
	}
}
