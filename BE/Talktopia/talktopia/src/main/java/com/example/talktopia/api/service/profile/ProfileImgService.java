package com.example.talktopia.api.service.profile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.example.talktopia.db.entity.user.ProfileImg;
import com.example.talktopia.db.repository.ProfileImgRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProfileImgService {

	private final AmazonS3Client amazonS3Client;

	private final ProfileImgRepository profileImgRepository;

	@Value("${cloud.aws.s3.bucket}")
	private String bucket;

	final String dirName = "profile";

	public ProfileImg upload(MultipartFile multipartFile, String dirName, String userId) throws IOException {

		File uploadFile = convertToFile(multipartFile)
			.orElseThrow(() -> new IllegalArgumentException("MultipartFile -> File로 변환에 실패했습니다."));

		String fileName = dirName + "/" + userId + " " + uploadFile.getName();
		log.info("created fileName : {}", fileName);

		// put - S3로 업로드
		String uploadImageUrl = putS3(uploadFile, fileName);
		// 로컬 파일 삭제
		removeFile(uploadFile);
		ProfileImg profileImg = ProfileImg.builder()
			.imgUrl(uploadImageUrl)
			.build();
		profileImgRepository.save(profileImg);
		log.info("이거인가?????"+uploadImageUrl);
		return profileImg;
	}

	public boolean delete(String profileUrl) {
		// S3에서 삭제
		log.info("profile url : {}", profileUrl);
		Pattern tokenPattern = Pattern.compile("(?<=profile/).*");
		Matcher matcher = tokenPattern.matcher(profileUrl);

		String temp = null;
		if (matcher.find()) {
			temp = matcher.group();
		}

		String originalName = URLDecoder.decode(temp);
		String filePath = dirName + "/" + originalName;
		log.info("originalName : {}", originalName);
		try {
			amazonS3Client.deleteObject(new DeleteObjectRequest(bucket, filePath));
			log.info("deletion complete : {}", filePath);
			return true;
		} catch (SdkClientException e) {
			log.info(e.getMessage());
			return false;
		}
	}

	private String putS3(File uploadFile, String fileName) {
		amazonS3Client.putObject(new PutObjectRequest(bucket, fileName, uploadFile)
			.withCannedAcl(CannedAccessControlList.PublicRead));
		return amazonS3Client.getUrl(bucket, fileName).toString();
	}

	// multipartFile -> File 형식으로 변환 및 로컬에 저장
	private Optional<File> convertToFile(MultipartFile file) throws IOException {
		File uploadFile = new File(Objects.requireNonNull(file.getOriginalFilename()));
		FileOutputStream fos = new FileOutputStream(uploadFile);
		fos.write(file.getBytes());
		fos.close();

		return Optional.of(uploadFile);
	}

	private void removeFile(File targetFile) {
		if (targetFile.exists()) {
			if (targetFile.delete()) {
				log.info("파일이 삭제되었습니다.");
			} else {
				log.info("파일이 삭제되지 않았습니다.");
			}
		}
	}


}
