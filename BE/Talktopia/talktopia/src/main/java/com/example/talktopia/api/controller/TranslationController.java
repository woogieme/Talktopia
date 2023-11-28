package com.example.talktopia.api.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

import com.example.talktopia.api.request.TransReq;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/naver")
@Slf4j
@RequiredArgsConstructor
public class TranslationController {

	@Value("${naver.id}")
	private String CLIENT_ID;
	@Value("${naver.secret}")
	private String CLIENT_SECRET;
	private static final String API_URL = "https://naveropenapi.apigw.ntruss.com/nmt/v1/translation";

	@PostMapping("/translate")
	public ResponseEntity<String> translateText(@RequestBody TransReq transReq) throws Exception{
		String params = "source=" + transReq.getSourceLang() + "&target=" + transReq.getTargetLang() +
			"&text=" + URLEncoder.encode(transReq.getText(), "UTF-8");
		URL url = new URL(API_URL);
		HttpURLConnection con = (HttpURLConnection) url.openConnection();
		con.setRequestMethod("POST");
		con.setRequestProperty("X-NCP-APIGW-API-KEY-ID", CLIENT_ID);
		con.setRequestProperty("X-NCP-APIGW-API-KEY", CLIENT_SECRET);
		con.setDoOutput(true);

		OutputStream outputStream = con.getOutputStream();
		outputStream.write(params.getBytes("UTF-8"));
		outputStream.flush();
		outputStream.close();

		int responseCode = con.getResponseCode();
		BufferedReader bufferedReader;
		if (responseCode == 200) {
			bufferedReader = new BufferedReader(new InputStreamReader(con.getInputStream()));
		} else {
			log.info("에러야?");
			bufferedReader = new BufferedReader(new InputStreamReader(con.getErrorStream()));
		}

		StringBuilder response = new StringBuilder();
		String line;
		while ((line = bufferedReader.readLine()) != null) {
			response.append(line);
		}

		bufferedReader.close();
		con.disconnect();

		ObjectMapper objectMapper = new ObjectMapper();
		JsonNode rootNode = objectMapper.readTree(response.toString());
		String translatedTextValue = rootNode.path("message").path("result").path("translatedText").asText();

		return ResponseEntity.ok().body(translatedTextValue);
	}
}

