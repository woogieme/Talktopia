package com.example.talktopia;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@CrossOrigin("*")
public class TalktopiaApplication {

	public static void main(String[] args) {
		SpringApplication.run(TalktopiaApplication.class, args);
	}

}
