package com.example.talktopia.api.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransReq {
	private String sourceLang;
	private String targetLang;
	private String text;
}
