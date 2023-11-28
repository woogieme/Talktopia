package com.example.talktopia.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.example.talktopia.common.util.JwtProvider;

import lombok.RequiredArgsConstructor;

/**
 * Security 설정
 */
@EnableWebSecurity
@EnableMethodSecurity
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtProvider jwtProvider;

	@Value("${spring.security.jwt.secret}")
	private String secretKey;

	@Bean
	public PasswordEncoder getPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	protected SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
		return httpSecurity.httpBasic()
			.disable()
			.csrf()
			.disable()
			.cors()
			.and()
			.authorizeRequests()
			.antMatchers("/api/v1/join/**", "/api/v1/user/**", "/api/v1/myPage/**", "/api/v1/room/**"
			, "/api/v1/social/**", "/api/v1/fcm/**", "/api/v1/saveChatLog/**", "/api/v1/manage/**",
				"/api/v1/topic/**", "/api/v1/ask/**", "/api/v1/report/**", "/api/v1/comment/**",
				"/api/v1/friend/**", "/api/v1/naver/**")
			.permitAll()
			.antMatchers("/api/v1/**")
			.authenticated()
			.and()
			.sessionManagement()
			.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
			.and()
			.addFilterBefore(new JwtFilter(jwtProvider, secretKey), UsernamePasswordAuthenticationFilter.class)
			.build();
	}

}
