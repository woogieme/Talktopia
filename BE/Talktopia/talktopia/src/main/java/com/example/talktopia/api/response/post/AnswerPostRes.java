package com.example.talktopia.api.response.post;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnswerPostRes {

	String userId;
	String contentContent;
	LocalDateTime contentCreateTime;


}
