package com.example.talktopia.api.request;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportReq {

	private String ruReporter;
	private String ruBully;
	private List<String> ruCategory;
	private String ruBody;
	private String vrSession;


}
