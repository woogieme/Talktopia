package com.example.talktopia.db.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.talktopia.db.entity.user.ProfileImg;

@Repository
public interface ProfileImgRepository extends JpaRepository<ProfileImg, Long> {

	ProfileImg findByImgNo(long imgNo);

}
