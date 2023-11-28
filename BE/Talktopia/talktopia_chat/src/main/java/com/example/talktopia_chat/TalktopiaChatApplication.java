package com.example.talktopia_chat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableCaching // 캐싱 사용
@EnableScheduling // 스케쥴링으로 redis -> mysql
public class TalktopiaChatApplication {

	public static void main(String[] args) {
		SpringApplication.run(TalktopiaChatApplication.class, args);
	}

}
