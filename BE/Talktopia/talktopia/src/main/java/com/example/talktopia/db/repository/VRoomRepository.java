package com.example.talktopia.db.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.talktopia.db.entity.vr.VRoom;

@Repository

public interface VRoomRepository extends JpaRepository<VRoom, Long> {

	@Query("SELECT vrSession FROM VRoom")
	List<String> findAllIds();

	VRoom findByVrSession(String roomId);

	@Transactional
	void deleteByVrSession(String vrSession);
}

