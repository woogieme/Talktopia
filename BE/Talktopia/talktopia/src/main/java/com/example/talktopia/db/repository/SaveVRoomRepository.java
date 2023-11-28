package com.example.talktopia.db.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.talktopia.db.entity.vr.SaveVRoom;

@Repository
public interface SaveVRoomRepository extends JpaRepository<SaveVRoom, Long> {

	SaveVRoom findBySvrSession(String svrSession);
}
