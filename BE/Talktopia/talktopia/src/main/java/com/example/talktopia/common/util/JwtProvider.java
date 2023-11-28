package com.example.talktopia.common.util;

import java.util.Date;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.example.talktopia.db.repository.TokenRepository;
import com.example.talktopia.db.repository.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 1. accessToken 생성
 * 2. refreshToken 생성
 * 3. 토큰에서 정보 빼내기
 * 4. 헤더 | Bearer 체크
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtProvider {

	@Value("${spring.security.jwt.secret}")
	String secretkey;
	// accessToken 생성
	public static String createAccessToken(String userId, String secretKey, Date date) {
		// Jwt에 정보 추가
		Claims claims = Jwts.claims();
		claims.put("userId", userId);

		return Jwts.builder()
			.setClaims(claims)
			.setIssuedAt(new Date())
			.setExpiration(date)
			.signWith(SignatureAlgorithm.HS256, secretKey) // 서명
			.compact();
	}

	public String generateToken(Authentication authentication) {
		String authorities = authentication.getAuthorities().stream()
			.map(GrantedAuthority::getAuthority)
			.collect(Collectors.joining(","));

		//Access Token 생성
		return Jwts.builder()
			.setSubject(authentication.getName())
			.claim("auth", authorities)
			.setExpiration(new Date(System.currentTimeMillis()+ 1000 * 60 * 30))
			.signWith(SignatureAlgorithm.HS256, secretkey)
			.compact();
	}

	// refreshToken 생성
	public static String createRefreshToken(String userId, String secretKey, Date date) {
		// Jwt에 정보 추가
		Claims claims = Jwts.claims();
		claims.put("userId", userId);

		return Jwts.builder()
			.setClaims(claims)
			.setIssuedAt(new Date())
			.setExpiration(date)
			.signWith(SignatureAlgorithm.HS256, secretKey) // 서명
			.compact();
	}

	/**
	 * 토큰을 헤더에 잘 담아서 보냈는지, Bearer가 앞에 붙어있는지 확인
	 * @param authorization: 헤더에 담아온 토큰
	 * @return 잘 담아서 보냈으면 True, 아니면 False
	 */
	public static boolean existTokenOrNotBearer(String authorization) {
		return authorization != null && authorization.startsWith("Bearer ");
	}

	/**
	 * 토큰에 저장된 클레임 꺼내기
	 * @param accessToken
	 * @param secretKey
	 * @return 클레임 반환
	 */
	public static Claims extractClaims(String accessToken, String secretKey) {
		return Jwts.parser()
			.setSigningKey(secretKey)
			.parseClaimsJws(accessToken)
			.getBody();
	}

}