package com.example.talktopia.common.config;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.talktopia.common.util.JwtProvider;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Jwt 토큰 검증
 * 1. Header에 토큰을 담았는지, 담았다면 정확한 형식인지
 * 2. 이상이 없으면 authenticationToken에 셋팅해서 다음 필터로 넘기기
 */
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

	private final JwtProvider jwtProvider;
	private final String secretKey;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
		FilterChain filterChain) throws ServletException, IOException {

		final String authorization = request.getHeader("Authorization");

		// 토큰을 안 보내거나 Bearer가 없으면
		if (!JwtProvider.existTokenOrNotBearer(authorization)) {
			filterChain.doFilter(request, response);
			return;
		}

		// Token꺼내기 - Bearer 제거
		String token = authorization.split(" ")[1];

		// token에서 클레임 꺼내기
		Claims claims = jwtProvider.extractClaims(token, secretKey);

		UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
			claims.get("userId"), null, List.of(new SimpleGrantedAuthority("USER")));

		authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
		SecurityContextHolder.getContext().setAuthentication(authenticationToken);
		filterChain.doFilter(request, response);

	}
}
